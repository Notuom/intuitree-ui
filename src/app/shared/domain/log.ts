export class Log {

  executionId: number;
  parentId: number;
  statusId: number;
  title: string;
  message: string;
  id: number;

  constructor(executionId: number, parentId: number, statusId: number, title: string, message: string, id?: number) {
    this.executionId = executionId;
    this.parentId = parentId;
    this.statusId = statusId;
    this.title = title;
    this.message = message;
    if (typeof id !== "undefined") this.id = id;
  }

}
