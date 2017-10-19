import {Component, OnInit} from '@angular/core';
import {DatabaseService} from "../../shared/database/database.service";
import {Execution} from "../../shared/domain/execution";
import {Tag} from "../../shared/domain/tag";
import {Status} from "../../shared/domain/status";

/**
 * Root component for the Execution Tree tab.
 */
@Component({
  selector: 'app-execution-tree',
  templateUrl: './execution-tree.component.html',
  styleUrls: ['./execution-tree.component.scss']
})
export class ExecutionTreeComponent implements OnInit {

  // Filter data
  allExecutions: Execution[] = [];
  allTags: Tag[] = [];
  allStatuses: Status[] = [];

  // Filter state
  filterExecution: Execution = null;
  filterTags: [Tag, string][] = [];
  filterStatus: Status = null;
  filterAnnotated: boolean = false;

  constructor(private db: DatabaseService) {
  }

  ngOnInit() {
    this.fetchFilterData();
  }

  /**
   * Retrieve the data that can be used in filters from the database.
   */
  fetchFilterData() {
    this.db.executions.toArray(executions => this.allExecutions = executions);
    this.db.tags.toArray(tags => this.allTags = tags);
    this.db.statuses.toArray(statuses => this.allStatuses = statuses);
  }

}
