export class LogTag {

  logId: number;
  tagId: number;
  value: string;
  id: number;

  constructor(logId: number, tagId: number, value: string, id?: number) {
    this.logId = logId;
    this.tagId = tagId;
    this.value = value;

    if (typeof id !== 'undefined') {
      this.id = id;
    }
  }

}
