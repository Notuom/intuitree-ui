/**
 * Cache class to keep statuses and tags for easier data binding during data import.
 */
export class ImportCache {

  executionId: number;
  statusIdMap: Map<string, number> = new Map();
  tagIdMap: Map<string, number> = new Map();
  lastLogId: number;

}
