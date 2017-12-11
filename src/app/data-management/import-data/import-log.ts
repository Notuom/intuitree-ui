import {ImportLogTag} from './import-log-tag';

/**
 * Log object when importing data from the JSON format.
 */
export class ImportLog {

  parentId: number;
  id: number;
  title: string;
  message: string;
  statusName: string;
  tags: ImportLogTag[];

  constructor(parentId: number, id: number, title: string, message: string, statusName: string, tags: ImportLogTag[] = []) {
    this.parentId = parentId;
    this.id = id;
    this.title = title;
    this.message = message;
    this.tags = tags;
    this.statusName = statusName;
  }

}
