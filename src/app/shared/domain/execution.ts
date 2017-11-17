export class Execution {

  title: string;
  message: string;
  id: number;

  constructor(title: string, message: string, id?: number) {
    this.title = title;
    this.message = message;
    if (typeof id !== 'undefined') {
      this.id = id;
    }
  }

}
