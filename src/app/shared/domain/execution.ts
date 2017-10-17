export class Execution {

  title: string;
  id: number;

  constructor(title: string, id?: number) {
    this.title = title;
    if (id) this.id = id;
  }

}
