export class Annotation {

  executionId: number;
  logId: number;
  changedStatusFromId: number;
  changedStatusToId: number;
  message: string;
  timestamp: number;
  id: number;

  constructor(executionId: number, logId: number, changedStatusFromId: number, changedStatusToId: number,
              message: string, timestamp: number, id?: number) {
    this.executionId = executionId;
    this.logId = logId;
    this.changedStatusFromId = changedStatusFromId;
    this.changedStatusToId = changedStatusToId;
    this.message = message;
    this.timestamp = timestamp;
    if (typeof id !== 'undefined') {
      this.id = id;
    }
  }

}
