import {Component, OnInit} from '@angular/core';
import {DatabaseService} from "../../shared/database/database.service";
import {Execution} from "../../shared/domain/execution";
import {Tag} from "../../shared/domain/tag";
import {Status} from "../../shared/domain/status";
import {Log} from "../../shared/domain/log";
import {TagValue} from "../domain/tag-value";
import * as d3 from "d3";

/**
 * Root component for the Execution Tree tab.
 */
@Component({
  selector: 'app-execution-tree',
  templateUrl: './execution-tree.component.html',
  styleUrls: ['./execution-tree.component.scss']
})
export class ExecutionTreeComponent implements OnInit {

  // TODO separate search filter panel and tree display components

  // Filter data
  allExecutions: Execution[] = [];
  allTags: Tag[] = [];
  allStatuses: Status[] = [];

  // Filter state
  filterView = "list";
  filterExecution: Execution = null;
  selectedTagFilter: Tag = null;
  filterTagValues: TagValue[] = [];
  filterStatus: Status = null;
  filterAnnotated: boolean = false;

  constructor(private db: DatabaseService) {
  }

  /**
   * When a tag is selected, ask for a filter value and add the tag filter.
   */
  addTagValueFilter() {
    if (this.selectedTagFilter !== null) {
      let filterTagValue = prompt(`Enter a filter value for tag "${this.selectedTagFilter.name}". Leave empty to search for all logs which are tagged with "${this.selectedTagFilter.name}".`);
      this.filterTagValues.push(new TagValue(this.selectedTagFilter, filterTagValue));

      // Change the tag select value back to the "add tag filter" option
      setTimeout(() => this.selectedTagFilter = null, 0);
    }
  }

  /**
   * When a tag value filter's "x" button is clicked, remove it from the list.
   * @param {number} index
   */
  removeTagValueFilter(index: number) {
    this.filterTagValues.splice(index, 1);
  }

  /**
   * Retrieve the data that can be used in filters from the database.
   */
  fetchFilterData() {
    this.db.executions.toArray(executions => this.allExecutions = executions);
    this.db.tags.toArray(tags => this.allTags = tags);
    this.db.statuses.toArray(statuses => this.allStatuses = statuses);
  }

  /**
   * Render the tree according to current parameters.
   */
  renderTree() {
    if (this.filterExecution !== null) {

      // TODO search for Logs that match the different criteria

      this.db.logs.where("executionId").equals(this.filterExecution.id).toArray(logs => {

        // Add Execution to tree as root node
        logs.unshift(new Log(this.filterExecution.id, null, null, this.filterExecution.title, "This is the root node for " + this.filterExecution.title, 0));
        console.log("All logs", logs);

        // Stratify data into hierarchical format using default D3 function (.id and .parentId)
        let root = d3.stratify()(logs);

        // Select DOM root element
        let div = d3.select("#treeRender");

        // Remove previous visualization
        div.selectAll("ul").remove();

        // Create new container for tree elements
        let ul = div.append("ul");

        // Bind data to list
        let node = ul.selectAll("li")
          .data(root.descendants())
          .enter().append("li")
          .style("margin-left", d => d.depth * 2 + "rem")
          .text(d => (<Log>d.data).title)
          .attr("title", d => (<Log>d.data).message);

        console.log("Root", root);
      }).catch(reject => {
        console.error(reject);
        alert("An error occurred while processing the tree. Please view the console for more details.");
      });
    }
  }

  ngOnInit() {
    this.fetchFilterData();
  }

}
