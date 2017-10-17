import {TestBed, inject, async} from '@angular/core/testing';

import {DatabaseService} from './database.service';
import {Execution} from "../domain/execution";

describe('DatabaseService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatabaseService]
    });
  });

  it('should be created', inject([DatabaseService], (db: DatabaseService) => {
    expect(db).toBeTruthy();
  }));

  it('#clearAll should clear everything', async(inject([DatabaseService], (db: DatabaseService) => {
    return db.executions.add(new Execution("TestExecution")).then(() => {
      db.clearAll().subscribe(
        () => {
          db.executions.count().then(count => {
            expect(count).toBe(0);
          });
        },
        error => {
          fail(error);
        }
      );
    });
  })));

  it('should store an Execution with auto-increment', async(inject([DatabaseService], (db: DatabaseService) => {
    return db.executions.add(new Execution("TestExecution")).then(() => {
      return db.executions.get(1);
    }).then(execution => {
      expect(execution.title).toBe("TestExecution");
      return db.executions.count();
    }).then(count => {
      expect(count).toBe(1);
    });
  })));

});
