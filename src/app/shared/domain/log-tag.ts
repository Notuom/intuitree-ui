export class LogTag {

  logId: number;
  tagId: number;
  value: string;

  constructor(logId: number, tagId: number, value: string) {
    this.logId = logId;
    this.tagId = tagId;
    this.value = value;
  }

}
