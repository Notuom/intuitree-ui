export class Tag {

  executionId: number;
  name: string;
  id: number;

  constructor(executionId: number, name: string, id?: number) {
    this.executionId = executionId;
    this.name = name;
    if (typeof id !== 'undefined') {
      this.id = id;
    }
  }

}
