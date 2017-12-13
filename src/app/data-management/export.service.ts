import {Injectable} from '@angular/core';
import {DatabaseService} from '../shared/database/database.service';
import {Execution} from '../shared/domain/execution';
import {ImportExecution} from './import-data/import-execution';

import {saveAs} from 'file-saver';
import {ImportData} from './import-data/import-data';
import {ImportStatus} from './import-data/import-status';
import {ImportTag} from './import-data/import-tag';
import {ImportLog} from './import-data/import-log';
import {ImportAnnotation} from './import-data/import-annotation';
import {Observable} from 'rxjs/Observable';
import {ImportLogTag} from './import-data/import-log-tag';
import {ExportCache} from './import-data/export-cache';

@Injectable()
export class ExportService {

  constructor(private db: DatabaseService) {
  }

  /**
   * Export an execution along all of its data to a JSON file which is then sent as a download in the browser.
   * @param {Execution} execution
   * @param {string} title
   */
  exportExecution(execution: Execution, title: string) {
    const exportCache: ExportCache = new ExportCache(new ImportExecution(title, execution.message));

    return Observable.fromPromise(
      Promise.resolve().then(() => {
        return this.db.statuses.where('executionId').equals(execution.id).toArray();
      }).then(statuses => {
        console.info('Exported Statuses', statuses);
        statuses.forEach(status => {
          exportCache.statusNameMap.set(status.id, status.name);
          exportCache.exportStatuses.push(new ImportStatus(status.name, status.color));
        });
        return this.db.tags.where('executionId').equals(execution.id).toArray();
      }).then(tags => {
        console.info('Exported Tags', tags);
        tags.forEach(tag => {
          exportCache.tagNameMap.set(tag.id, tag.name);
          exportCache.exportTags.push(new ImportTag(tag.name));
        });
        return this.db.logs.where('executionId').equals(execution.id).sortBy(':id');
      }).then(logs => {
          console.info('Exported Logs', logs);
          const logIds = [];
          // Shift all IDs by the first ID so that the first Log has ID 1 in the exported file
          const idShift = logs[0].id - 1;
          logs.forEach(log => {
            const importLog = new ImportLog(log.parentId - idShift, log.id - idShift, log.title,
              log.message, exportCache.statusNameMap.get(log.statusId));
            exportCache.logIdMap.set(log.id, importLog);
            exportCache.exportLogs.push(importLog);
            logIds.push(log.id);
          });
          return this.db.logTags.where('logId').anyOf(logIds).toArray();
        }
      ).then(logTags => {
        console.info('Exported LogTags', logTags);
        logTags.forEach(logTag => {
          exportCache.logIdMap.get(logTag.logId).tags.push(new ImportLogTag(exportCache.tagNameMap.get(logTag.tagId), logTag.value));
        });
        return this.db.annotations.where('executionId').equals(execution.id).toArray();
      }).then(annotations => {
        console.info('Exported annotations', annotations);
        annotations.map(annotation => new ImportAnnotation(annotation.logId,
          exportCache.statusNameMap.get(annotation.changedStatusFromId),
          exportCache.statusNameMap.get(annotation.changedStatusToId),
          annotation.message, annotation.timestamp
        ));
      }).then(() => {
        saveAs(new Blob([JSON.stringify(exportCache.toImportData())]), title + '.json');
      })
    );
  }

}
