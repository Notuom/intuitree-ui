/**
 * Root object when importing data from the JSON format.
 */
import {ImportExecution} from './import-execution';
import {ImportStatus} from './import-status';
import {ImportTag} from './import-tag';
import {ImportLog} from './import-log';

export class ImportData {

  execution: ImportExecution;
  statuses: Array<ImportStatus>;
  tags: Array<ImportTag>;
  logs: Array<ImportLog>;

}
