export class Tag {

  name: string;
  id: number;

  constructor(name: string, id?: number) {
    this.name = name;
    if(id) this.id = id;
  }

}
