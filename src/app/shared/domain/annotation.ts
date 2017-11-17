export class Annotation {

  executionId: number;
  logId: number;
  changedStatusId: number;
  message: string;
  timestamp: number;
  id: number;

  constructor(executionId: number, logId: number, changedStatusId: number, message: string, timestamp: number, id?: number) {
    this.executionId = executionId;
    this.logId = logId;
    this.changedStatusId = changedStatusId;
    this.message = message;
    this.timestamp = timestamp;
    if (typeof id !== 'undefined') {
      this.id = id;
    }
  }

}
