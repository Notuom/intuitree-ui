export class Status {

  static readonly defaultColor = '#666';

  executionId: number;
  name: string;
  color: string;
  id: number;

  constructor(executionId: number, name: string, color: string, id?: number) {
    this.executionId = executionId;
    this.name = name;
    this.color = color;
    if (typeof id !== 'undefined') {
      this.id = id;
    }
  }

}
