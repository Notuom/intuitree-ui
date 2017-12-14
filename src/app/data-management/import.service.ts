import {Injectable} from '@angular/core';
import 'rxjs/add/observable/throw';
import * as ajv from 'ajv';

import {ImportCache} from './import-data/import-cache';
import {ImportExecution} from './import-data/import-execution';
import {ImportData} from './import-data/import-data';
import {ImportStatus} from './import-data/import-status';
import {ImportTag} from './import-data/import-tag';
import {ImportLog} from './import-data/import-log';
import {DatabaseService} from '../shared/database/database.service';
import {Execution} from '../shared/domain/execution';
import {Status} from '../shared/domain/status';
import {Tag} from '../shared/domain/tag';
import {Log} from '../shared/domain/log';
import {LogTag} from '../shared/domain/log-tag';
import {Observable} from 'rxjs/Observable';
import {ImportAnnotation} from './import-data/import-annotation';
import {Annotation} from '../shared/domain/annotation';

import schema from './import-data/logs-schema';

/**
 * Handles the import core logic.
 */
@Injectable()
export class ImportService {

  validate = ajv().compile(schema);

  constructor(private db: DatabaseService) {
    console.info('SCHEMA', schema);
  }

  /**
   * Validate and import from the JSON-based file Intuitree file format.
   * @param {string} jsonString a string representation of the json data to import
   */
  importJsonData(jsonString: string): Observable<any> {
    try {
      const importData: ImportData = JSON.parse(jsonString);

      if (!this.validate(importData)) {
        return Observable.throw({
          _message: 'Invalid JSON file. Complete error log from validator follows.',
          errors: this.validate.errors
        });
      }

      const cache = new ImportCache();

      return Observable.fromPromise(
        Promise.resolve().then(() => {
          return this.importExecution(importData.execution);
        }).then((executionId: number) => {
          cache.executionId = executionId;
          return this.importStatuses(cache, importData.statuses);
        }).then((lastStatusId: number) => {
          importData.statuses.reverse().forEach(importStatus => {
            cache.statusIdMap.set(importStatus.name, lastStatusId--);
          });
          return this.importTags(cache, importData.tags);
        }).then((lastTagId: number) => {
          importData.tags.reverse().forEach(importTag => {
            cache.tagIdMap.set(importTag.name, lastTagId--);
          });
          return this.db.logs.orderBy(':id').last();
        }).then((lastLog: Log) => {
          if (typeof lastLog !== 'undefined') {
            // There are logs in the database
            cache.lastLogId = lastLog.id;
          } else {
            // There are no logs in the database
            cache.lastLogId = 0;
          }
          return this.importLogs(cache, importData.logs);
        }).then(() => {
          return this.importLogTags(cache, importData.logs);
        }).then(() => {

          // Annotations are optional, only present when exported from the application and not the library
          if ((<ImportData>importData).annotations) {
            return this.importAnnotations(cache, importData.annotations);
          } else {
            return Promise.resolve(0);
          }
        })
      );
    }
    catch
      (e) {
      alert('The file couldn\'t be loaded: format was not JSON.');
      console.error(e);
    }
  }

  private importExecution(importExecution: ImportExecution) {
    return this.db.executions.add(new Execution(importExecution.title, importExecution.message));
  }

  private importStatuses(cache: ImportCache, importStatuses: ImportStatus[]) {
    return this.db.statuses.bulkAdd(
      importStatuses.map(importStatus => new Status(cache.executionId, importStatus.name, importStatus.color))
    );
  }

  private importTags(cache: ImportCache, importTags: ImportTag[]) {
    return this.db.tags.bulkAdd(
      importTags.map(importTag => new Tag(cache.executionId, importTag.name))
    );
  }

  private importLogs(cache: ImportCache, importLogs: ImportLog[]) {
    return this.db.logs.bulkAdd(
      importLogs.map(importLog => new Log(cache.executionId,
        // ParentID = 0 is a special value, but otherwise, transpose the parent's LogID
        importLog.parentId === 0 ? 0 : importLog.parentId + cache.lastLogId,
        cache.statusIdMap.get(importLog.statusName),
        importLog.title,
        importLog.message,
        // Transpose the LogID according to the max ID before starting the bulk insert.
        importLog.id + cache.lastLogId
      ))
    );
  }

  private importLogTags(cache: ImportCache, importLogs: ImportLog[]) {
    const logTags: LogTag[] = [];
    importLogs.forEach(importLog => {
      importLog.tags.forEach(importLogTag => {
        logTags.push(new LogTag(cache.executionId,
          importLog.id + cache.lastLogId,
          cache.tagIdMap.get(importLogTag.tagName),
          importLogTag.value));
      });
    });

    return this.db.logTags.bulkAdd(logTags);
  }

  private importAnnotations(cache: ImportCache, importAnnotations: ImportAnnotation[]) {
    const annotations: Annotation[] = [];
    importAnnotations.forEach(importAnnotation => {
      annotations.push(new Annotation(cache.executionId,
        importAnnotation.logId + cache.lastLogId,
        cache.statusIdMap.get(importAnnotation.changedStatusFromName),
        cache.statusIdMap.get(importAnnotation.changedStatusToName),
        importAnnotation.message, importAnnotation.timestamp));
    });

    return this.db.annotations.bulkAdd(annotations);
  }

}
