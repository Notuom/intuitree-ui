/**
 * Status object when importing data from the JSON format.
 */
export class ImportStatus {

  name: string;
  color: string;

  constructor(name: string, color: string) {
    this.name = name;
    this.color = color;
  }

}
