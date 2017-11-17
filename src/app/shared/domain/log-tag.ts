export class LogTag {

  executionId: number;
  logId: number;
  tagId: number;
  value: string;
  id: number;

  constructor(executionId: number, logId: number, tagId: number, value: string, id?: number) {
    this.executionId = executionId;
    this.logId = logId;
    this.tagId = tagId;
    this.value = value;

    if (typeof id !== 'undefined') {
      this.id = id;
    }
  }

}
