import {ImportTag} from './import-tag';
import {ImportAnnotation} from './import-annotation';
import {ImportLog} from './import-log';
import {ImportStatus} from './import-status';
import {ImportData} from './import-data';
import {ImportExecution} from './import-execution';

export class ExportCache {

  exportExecution: ImportExecution;

  statusNameMap: Map<number, string> = new Map();
  tagNameMap: Map<number, string> = new Map();
  logIdMap: Map<number, ImportLog> = new Map();

  statuses: ImportStatus[] = [];
  tags: ImportTag[] = [];
  logs: ImportLog[] = [];
  annotations: ImportAnnotation[] = [];

  idShift = 0;

  constructor(exportExecution: ImportExecution) {
    this.exportExecution = exportExecution;
  }

  /**
   * Return a shifted logId, respecting the fact that ID 0 is a special value.
   * @param {number} logId
   * @returns {number | number}
   */
  shiftLogId(logId: number) {
    return logId > 0 ? logId - this.idShift : 0;
  }

  /**
   * Convert to an ImportData instance containing everything in the cache.
   * @returns {ImportData}
   */
  toImportData(): ImportData {
    return new ImportData(this.exportExecution, this.statuses, this.tags,
      this.logs, this.annotations);
  }

}
