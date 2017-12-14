import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../shared/database/database.service';
import {ImportService} from '../import.service';
import {Execution} from '../../shared/domain/execution';
import {Log} from '../../shared/domain/log';
import {Status} from '../../shared/domain/status';
import {Tag} from '../../shared/domain/tag';
import {LogTag} from '../../shared/domain/log-tag';
import {Observable} from 'rxjs/Observable';
import {Annotation} from '../../shared/domain/annotation';
import {ExportService} from '../export.service';

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

  constructor(private db: DatabaseService, private imp: ImportService, private exp: ExportService) {
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
        this.imp.importJsonData((<FileReader>doneEvent.target).result).subscribe(success => {
          alert('Import is complete!');
        }, error => {
          console.error(error);
          alert('An error occured during import. View console for more details.');
        }, () => {
          this.refreshExecutions();
        });
      };

      reader.readAsText(files[0]);
    }
  }

  /**
   * Remove all data from the database.
   */
  removeAllData() {
    if (confirm('Are you sure you want to remove all of the data? This is not reversible; data will have to be imported again.')) {
      this.db.clearAll().subscribe(success => {
          this.refreshExecutions();
          alert('All data has been removed.');
        },
        error => {
          console.error(error);
          alert('Error when deleting data. See console for details.');
        });
    }
  }

  /**
   * Handle when the Export button is clicked.
   */
  exportExecution() {
    if (this.execution !== null) {
      const newTitle = prompt('Please set a name for the exported execution', this.execution.title);
      if (newTitle !== null) {
        this.exp.exportExecution(this.execution, newTitle);
      }
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

  /**
   * Remove the selection from the execution dropdown and refresh its data from the database.
   */
  refreshExecutions() {
    this.execution = null;
    this.db.executions.toArray(executions => {
      this.allExecutions = executions;
    });
  }

  /**
   * Upon init, get all executions.
   */
  ngOnInit() {
    this.refreshExecutions();
  }

}
