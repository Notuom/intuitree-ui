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

  exportStatuses: ImportStatus[] = [];
  exportTags: ImportTag[] = [];
  exportLogs: ImportLog[] = [];
  exportAnnotations: ImportAnnotation[] = [];

  constructor(exportExecution: ImportExecution) {
    this.exportExecution = exportExecution;
  }

  /**
   * Convert to an ImportData instance containing everything in the cache.
   * @returns {ImportData}
   */
  toImportData(): ImportData {
    return new ImportData(this.exportExecution, this.exportStatuses, this.exportTags,
      this.exportLogs, this.exportAnnotations);
  }

}
