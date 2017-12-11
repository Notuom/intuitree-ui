import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../shared/database/database.service';
import {DataManagementService} from '../data-management.service';
import {Execution} from '../../shared/domain/execution';
import {Log} from '../../shared/domain/log';
import {Status} from '../../shared/domain/status';
import {Tag} from '../../shared/domain/tag';
import {LogTag} from '../../shared/domain/log-tag';
import {Observable} from 'rxjs/Observable';
import {Annotation} from '../../shared/domain/annotation';

/**
 * Root component for the Data Management tab.
 */
@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
})
export class DataManagementComponent implements OnInit {

  allExecutions: Execution[];
  execution: Execution = null;

  constructor(private db: DatabaseService, private dm: DataManagementService) {
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
   * Handle when a file is selected.
   * @param {Event} event
   */
  handleImport(event: Event) {
    const files: FileList = (<HTMLInputElement>event.target).files;

    if (files.length > 0) {
      const reader = new FileReader();

      reader.onload = (doneEvent: ProgressEvent) => {
        this.dm.importJsonData((<FileReader>doneEvent.target).result).subscribe(success => {

        }, error => {

        }, () => {
          this.refreshExecutions();
        });
      };

      reader.readAsText(files[0]);
    }
  }

  /**
   * Handle when the Export button is clicked.
   */
  exportExecution() {
    if (this.execution !== null) {

    } else {
      alert('Please select an execution first.');
    }
  }

  /**
   * Handle when the Delete button is clicked.
   */
  deleteExecution() {
    if (this.execution !== null
      && confirm('Are you sure you want to remove all of the data for this execution? This is not reversible.')) {

      this.db.removeExecution(this.execution).subscribe(success => {
        console.info(success);
      }, error => {
        console.error(error);
        alert('Error when deleting execution. See console for details.');
      }, () => {
        this.refreshExecutions();
      });
    } else {
      alert('Please select an execution first.');
    }
  }

  refreshExecutions() {
    this.execution = null;
    this.db.executions.toArray(executions => {
      this.allExecutions = executions;
    });
  }

  /**
   * Temporary method to generate test data until data format is settled import is complete.
   * TODO remove.
   */
  generateTestData() {

    // Remove everything first
    this.db.clearAll().subscribe(() => {

      // Add everything in parallel and alert when completed
      Observable.forkJoin(
        Observable.fromPromise(this.db.executions.add(new Execution('Test Execution', 'Test Execution Details', 1))),
        Observable.fromPromise(this.db.statuses.bulkAdd([
          new Status(1, 'Success', '#A3D977', 1),
          new Status(1, 'Warning', '#FFDF71', 2),
          new Status(1, 'Error', '#FF8F80', 3)
        ])),
        Observable.fromPromise(this.db.tags.bulkAdd([
          new Tag(1, 'section', 1),
          new Tag(1, 'paragraph', 2),
          new Tag(1, 'sentence', 3)
        ])),
        Observable.fromPromise(this.db.logs.bulkAdd([
          new Log(1, 0, 3, 'Section 1', 'Section 1 failed because there was no paragraph template.', 1),
          new Log(1, 0, 2, 'Section 2', 'Section 2 failed because it was misconfigured, so it was skipped.', 2),
          new Log(1, 0, 1, 'Section 3', 'Section 3 was fulfilled.', 3),
          new Log(1, 3, 1, 'Paragraph 3-1', 'Paragraph 3-1 was fulfilled. Paragraph Template chosen: ExampleTemplate31. etc.', 4),
          new Log(1, 3, 3, 'Paragraph 3-2', 'Paragraph 3-2 failed because there were no valid templates.', 5),
          new Log(1, 3, 1, 'Paragraph 3-3', 'Paragraph 3-3 was fulfilled. Paragraph Template Chosen: ExampleTemplate33. etc.', 6),
          new Log(1, 6, 1, 'Sentence 3-3-1', 'Sentence 3-3-1 was fulfilled. Sentence content: Lorem ipsum!', 7),
          new Log(1, 6, 1, 'Sentence 3-3-2', 'Sentence 3-3-1 was fulfilled. Sentence content: Lorem ipsum!', 8),
          new Log(1, 6, 1, 'Sentence 3-3-3', 'Sentence 3-3-1 was fulfilled. Sentence content: Lorem ipsum!', 9)
        ])),
        Observable.fromPromise(this.db.logTags.bulkAdd([
          new LogTag(1, 1, 1, '1'),
          new LogTag(1, 2, 1, '2'),
          new LogTag(1, 3, 1, '3'),
          new LogTag(1, 4, 2, '3-1'),
          new LogTag(1, 5, 2, '3-2'),
          new LogTag(1, 6, 2, '3-3'),
          new LogTag(1, 7, 3, '3-3-1'),
          new LogTag(1, 8, 3, '3-3-2'),
          new LogTag(1, 9, 3, '3-3-3')
        ])),
        Observable.fromPromise(this.db.annotations.bulkAdd([
          new Annotation(1, 1, 2, 1, 'Changed the status because I wanted to.', 0)
        ]))
      ).subscribe(success => {
          this.refreshExecutions();
          alert('Test data has been generated.');
        },
        error => alert('Error when generating test data: ' + error));
    });
  }

  ngOnInit() {
    this.refreshExecutions();
  }

}
