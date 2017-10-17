export class Annotation {

  logId: number;
  changedStatusId: number;
  message: string;
  timestamp: number;
  id: number;

  constructor(logId: number, changedStatusId: number, message: string, timestamp: number, id?: number) {
    this.logId = logId;
    this.changedStatusId = changedStatusId;
    this.message = message;
    this.timestamp = timestamp;
    if(id) this.id = id;
  }

}
