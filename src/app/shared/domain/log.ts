import {Status} from "./status";
import {LogTag} from "./log-tag";

export class Log {

  // Data stored in database
  executionId: number;
  parentId: number;
  statusId: number;
  title: string;
  message: string;
  id: number;

  // Data linked externally when retrieved from database
  status: Status;
  logTags: LogTag[];
  highlight: boolean;

  constructor(executionId: number, parentId: number, statusId: number, title: string, message: string, id?: number) {
    this.executionId = executionId;
    this.parentId = parentId;
    this.statusId = statusId;
    this.title = title;
    this.message = message;
    if (typeof id !== 'undefined') {
      this.id = id;
    }
    this.status = null;
    this.logTags = [];
    this.highlight = false;
  }

}
