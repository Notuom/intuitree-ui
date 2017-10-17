import {Injectable} from '@angular/core';
import Dexie from "dexie";
import {Execution} from "../domain/execution";
import {Status} from "../domain/status";
import {Tag} from "../domain/tag";
import {Log} from "../domain/log";
import {Annotation} from "../domain/annotation";
import {LogTag} from "../domain/log-tag";

import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/forkJoin';

// IndexedDB schema version. Updated it if the schema changes.
const dbVersion = 1;

@Injectable()
export class DatabaseService extends Dexie {

  executions: Dexie.Table<Execution, number>;
  statuses: Dexie.Table<Status, number>;
  tags: Dexie.Table<Tag, number>;
  logs: Dexie.Table<Log, number>;
  annotations: Dexie.Table<Annotation, number>;
  logTags: Dexie.Table<LogTag, number>;

  constructor() {
    super('intuitree');

    this.version(dbVersion).stores({
      executions: '++id, title',
      statuses: '++id, name, color',
      tags: '++id, name',
      logs: '++id, executionId, parentId, statusId, title, message',
      annotations: '++id, logId, changedStatusId, message, timestamp',
      logTags: '++id, name'
    });

    this.executions.mapToClass(Execution);
    this.statuses.mapToClass(Status);
    this.tags.mapToClass(Tag);
    this.logs.mapToClass(Log);
    this.annotations.mapToClass(Annotation);
    this.logTags.mapToClass(LogTag);
  }

  /**
   * Clear all tables contents and return an observable.
   * @returns {Observable<[any , any , any , any , any , any]>}
   */
  clearAll() {
    return Observable.forkJoin(
      Observable.fromPromise(this.executions.clear()),
      Observable.fromPromise(this.statuses.clear()),
      Observable.fromPromise(this.tags.clear()),
      Observable.fromPromise(this.logs.clear()),
      Observable.fromPromise(this.annotations.clear()),
      Observable.fromPromise(this.logTags.clear())
    );
  }

}
