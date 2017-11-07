export class Status {

  name: string;
  color: string;
  id: number;

  constructor(name: string, color: string, id?: number) {
    this.name = name;
    this.color = color;
    if (typeof id !== 'undefined') {
      this.id = id;
    }
  }

}
