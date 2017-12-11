/**
 * LogTag object when importing data from the JSON format.
 */
export class ImportLogTag {

  tagName: string;
  value: string;

  constructor(tagName: string, value: string) {
    this.tagName = tagName;
    this.value = value;
  }

}
