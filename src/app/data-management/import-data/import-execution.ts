/**
 * Execution object when importing data from the JSON format.
 */
export class ImportExecution {

  // Current (latest) version for the import/export format
  public static readonly VERSION = 1;

  title: string;
  message: string;

  // Version for the import/export format to allow forward-compatibilty
  version: number = ImportExecution.VERSION;

  constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }

}
