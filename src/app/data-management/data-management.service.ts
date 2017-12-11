import {Injectable} from '@angular/core';
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

/**
 * Handles the import/export core logic.
 */
@Injectable()
export class DataManagementService {

  constructor(private db: DatabaseService) {
  }

  /**
   * Validate and import from the JSON-based file Intuitree file format.
   * @param {string} jsonString a string representation of the json data to import
   */
  importJsonData(jsonString: string) {
    console.info(jsonString.length);
    try {
      const importData: ImportData = JSON.parse(jsonString);

      // TODO validate against JSON schema here to make sure everything is valid
      const cache = new ImportCache();

      // TODO import annotations

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
        console.log('Cache', cache.statusIdMap, cache.tagIdMap);
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
        alert('Import is complete!');
      }).catch(e => {
        console.error(e);
        alert('An error occured during import. View console for more details.');
      });

      console.info(importData);
    } catch (e) {
      alert('The file couldn\'t be loaded: format was not JSON.');
      console.error(e);
    }
  }

  importExecution(importExecution: ImportExecution) {
    return this.db.executions.add(new Execution(importExecution.title, importExecution.message));
  }

  importStatuses(cache: ImportCache, importStatuses: Array<ImportStatus>) {
    return this.db.statuses.bulkAdd(
      importStatuses.map(importStatus => new Status(cache.executionId, importStatus.name, importStatus.color))
    );
  }

  importTags(cache: ImportCache, importTags: Array<ImportTag>) {
    return this.db.tags.bulkAdd(
      importTags.map(importTag => new Tag(cache.executionId, importTag.name))
    );
  }

  importLogs(cache: ImportCache, importLogs: Array<ImportLog>) {
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

  importLogTags(cache: ImportCache, importLogs: Array<ImportLog>) {
    const logTags: Array<LogTag> = [];
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

}
