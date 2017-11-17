/**
 * Log object when importing data from the JSON format.
 */
import {ImportLogTag} from './import-log-tag';

export class ImportLog {

  parentId: number;
  id: number;
  title: string;
  message: string;
  tags: Array<ImportLogTag>;
  statusName: string;

}
