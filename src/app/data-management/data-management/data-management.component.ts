import {Component} from '@angular/core';
import {DatabaseService} from '../../shared/database/database.service';
import {Execution} from '../../shared/domain/execution';
import {Log} from '../../shared/domain/log';
import {Status} from '../../shared/domain/status';
import {Tag} from '../../shared/domain/tag';
import {LogTag} from '../../shared/domain/log-tag';
import {Observable} from 'rxjs/Observable';

/**
 * Root component for the Data Management tab.
 */
@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
})
export class DataManagementComponent {

  constructor(private db: DatabaseService) {
  }

  /**
   * Remove all data from the database.
   */
  removeAllData() {
    if (confirm('Are you sure you want to remove all of the data? This is not reversible; data will have to be imported again.')) {
      this.db.clearAll().subscribe(success => alert('All data has been removed.'),
        error => alert('Error when deleting data: ' + error));
    }
  }

  /**
   * Temporary method to generate test data until data format is settled import is complete.
   * TODO replace with import.
   */
  generateTestData() {

    // Remove everything first
    this.db.clearAll().subscribe(() => {

      // Add everything in parallel and alert when completed
      Observable.forkJoin(
        Observable.fromPromise(this.db.executions.add(new Execution('Test Execution', 1)).then()),
        Observable.fromPromise(this.db.statuses.bulkAdd([
          new Status('Success', '#A3D977', 1),
          new Status('Warning', '#FFDF71', 2),
          new Status('Error', '#FF8F80', 3)
        ])),
        Observable.fromPromise(this.db.tags.bulkAdd([
          new Tag('section', 1),
          new Tag('paragraph', 2),
          new Tag('sentence', 3)
        ])),
        Observable.fromPromise(this.db.logs.bulkAdd([
          new Log(1, 0, 3, 'Section 1', 'Section 1 failed because there was no paragraph template.', 1),
          new Log(1, 0, 2, 'Section 2', 'Section 2 failed because it was misconfigured, so it was skipped.', 2),
          new Log(1, 0, 1, 'Section 3', 'Section 3 was fulfilled.', 3),
          new Log(1, 3, 1, 'Paragraph 3-1', 'Paragraph 3-1 was fulfilled. Paragraph Template chosen: ExampleTemplate31. etc.', 4),
          new Log(1, 3, 3, 'Paragraph 3-2', 'Paragraph 3-2 failed because there were no valid templates.', 5),
          new Log(1, 3, 1, 'Paragraph 3-3', 'Paragraph 3-3 was fulfilled. Paragraph Template Chosen: ExampleTemplate33. etc.', 6),
          new Log(1, 6, 1, 'Sentence 3-3-1', 'Sentence 3-3-1 was fulfilled. Sentence content: Lorem ipsum!', 7)
        ])),
        Observable.fromPromise(this.db.logTags.bulkAdd([
          new LogTag(1, 1, '1'),
          new LogTag(2, 1, '2'),
          new LogTag(3, 1, '3'),
          new LogTag(4, 2, '3-1'),
          new LogTag(5, 2, '3-2'),
          new LogTag(6, 2, '3-3'),
          new LogTag(7, 3, '3-3-1'),
          new LogTag(8, 3, '3-3-2'),
          new LogTag(9, 3, '3-3-3')
        ]))
      ).subscribe(success => alert('Test data has been generated.'),
        error => alert('Error when generating test data: ' + error));
    });
  }

}
