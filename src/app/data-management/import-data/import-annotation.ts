/**
 * Execution object when importing an annotation from the JSON format.
 */
export class ImportAnnotation {

  logId: number;
  changedStatusFromName: string;
  changedStatusToName: string;
  message: string;
  timestamp: number;

  constructor(logId: number, changedStatusFromName: string, changedStatusToName: string, message: string, timestamp: number) {
    this.logId = logId;
    this.changedStatusFromName = changedStatusFromName;
    this.changedStatusToName = changedStatusToName;
    this.message = message;
    this.timestamp = timestamp;
  }

}
