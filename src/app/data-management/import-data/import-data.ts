import {ImportExecution} from './import-execution';
import {ImportStatus} from './import-status';
import {ImportTag} from './import-tag';
import {ImportLog} from './import-log';
import {ImportAnnotation} from './import-annotation';

/**
 * Root object when importing/exporting data from/to the JSON format.
 */
export class ImportData {

  execution: ImportExecution;
  statuses: ImportStatus[];
  tags: ImportTag[];
  logs: ImportLog[];
  annotations: ImportAnnotation[];

}
