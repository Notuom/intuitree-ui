import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../shared/database/database.service';
import {Execution} from '../../shared/domain/execution';
import {Tag} from '../../shared/domain/tag';
import {Status} from '../../shared/domain/status';
import {Log} from '../../shared/domain/log';
import {TagValue} from '../domain/tag-value';
import {TreeViewComponent} from '../tree-view/tree-view.component';
import {LogTag} from '../../shared/domain/log-tag';
import {Annotation} from '../../shared/domain/annotation';

/**
 * Root component for the Execution Tree tab.
 * Contains search filters and execution tree view.
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

  // Database maps for linking to data
  executionMap: Map<number, Execution> = new Map();
  tagMap: Map<number, Tag> = new Map();
  statusMap: Map<number, Status> = new Map();

  // Filter state
  execution: Execution = null;
  selectedTagFilter: Tag = null;
  filterTagValues: TagValue[] = [];
  filterStatus: Status = null;
  filterAnnotated = false;

  // Tree view parameters
  viewMode = TreeViewComponent.listViewMode;
  viewLogs: Log[] = [];
  activeLog: Log = null;

  constructor(private db: DatabaseService) {
  }

  /**
   * When a tag is selected, ask for a filter value and add the tag filter.
   */
  addTagValueFilter() {
    if (this.selectedTagFilter !== null) {
      const filterTagValue = prompt(`Enter a filter value for tag '${this.selectedTagFilter.name}'.\n` +
        `Leave empty to search for all logs which are tagged with '${this.selectedTagFilter.name}'.`);
      this.filterTagValues.push(new TagValue(this.selectedTagFilter, filterTagValue.trim()));

      // Change the tag select value back to the 'add tag filter' option
      setTimeout(() => this.selectedTagFilter = null, 0);
      this.applyFilters();
    }
  }

  /**
   * When a tag value filter's 'x' button is clicked, remove it from the list.
   * @param {number} index
   */
  removeTagValueFilter(index: number) {
    this.filterTagValues.splice(index, 1);
    this.applyFilters();
  }

  /**
   * Retrieve the data that can be used in filters from the database.
   */
  fetchFilterData() {
    this.db.executions.toArray(executions => {
      this.allExecutions = executions;
      executions.forEach(execution => this.executionMap.set(execution.id, execution));
    });
  }

  /**
   * Apply the filters and retrieve the adequate data set for rendering.
   */
  applyFilters() {
    let logs: Log[], logIds: number[];
    const completeLogTagMap: Map<number, LogTag[]> = new Map();

    if (this.execution !== null) {

      // Start a promise chain
      Promise.resolve().then(() => {

        // Get tags for this execution
        return this.db.tags
          .where('executionId').equals(this.execution.id).toArray();
      }).then((queriedTags: Tag[]) => {

        // Store tags in map
        this.allTags = queriedTags;
        queriedTags.forEach(tag => this.tagMap.set(tag.id, tag));

        // Get statuses for this execution
        return this.db.statuses
          .where('executionId').equals(this.execution.id).toArray();
      }).then((queriedStatuses: Status[]) => {

        // Store statuses in map
        this.allStatuses = queriedStatuses;
        queriedStatuses.forEach(status => this.statusMap.set(status.id, status));

        // Build query for logs according to specified filters
        let logQuery: Promise<Log[]>;
        if (this.filterStatus !== null) {
          // Execution ID + Status ID are specified
          logQuery = this.db.logs
            .where('[executionId+statusId]').equals([this.execution.id, this.filterStatus.id])
            .toArray();
        } else {
          // Execution ID only is specified
          logQuery = this.db.logs
            .where('executionId').equals(this.execution.id)
            .toArray();
        }

        return logQuery;
      }).then((queriedLogs: Log[]) => {
        console.info('Queried logs', queriedLogs);

        logs = queriedLogs;

        // Retrieve Log IDs for annotated logs, if applicable
        let annotationQuery: Promise<Annotation[]>;
        if (this.filterAnnotated) {
          annotationQuery = this.db.annotations.toArray();
        } else {
          annotationQuery = new Promise((resolve => resolve(null)));
        }

        return annotationQuery;
      }).then((queriedAnnotations: Annotation[]) => {
        console.info('Queried annotations', queriedAnnotations);
        if (queriedAnnotations !== null) {
          const logsWithAnnotationIds = queriedAnnotations.map(annotation => annotation.logId);
          logs = logs.filter(log => logsWithAnnotationIds.includes(log.id));
        }

        logIds = logs.map(log => log.id);

        // Retrieve all LogTags for current Logs
        return this.db.logTags
          .where('logId').anyOf(logIds)
          .toArray();
      }).then((queriedLogTags: LogTag[]) => {
        console.info('Queried LogTags', queriedLogTags);

        // Store all filter TagValues by TagId in a map
        const filterTagValueMap: Map<number, TagValue[]> = new Map();
        if (this.filterTagValues.length > 0) {
          this.filterTagValues.forEach(tagValue => {
            if (!filterTagValueMap.has(tagValue.tag.id)) {
              filterTagValueMap.set(tagValue.tag.id, []);
            }
            filterTagValueMap.get(tagValue.tag.id).push(tagValue);
          });
        }
        console.info('filterTagValueMap', filterTagValueMap);

        // Store all LogTags retrieved by LogId in a map
        const fulfilledLogTagMap: Map<number, LogTag[]> = new Map();
        queriedLogTags.forEach(logTag => {

          // Corresponding LogId not in maps : add empty array to maps
          if (!completeLogTagMap.has(logTag.logId)) {
            completeLogTagMap.set(logTag.logId, []);
            fulfilledLogTagMap.set(logTag.logId, []);
          }

          // Flag which indicates if the current LogTag matches the search criteria
          let logTagFulfilled: boolean;

          if (this.filterTagValues.length > 0) {

            // There are filters for TagValues in general, so this entry must be filtered out if it doesn't match
            logTagFulfilled = false;

            if (filterTagValueMap.has(logTag.tagId)) {

              // Retrieve all values that can be matched in order for this LogTag to match the criteria
              const filterTagValuesForTag = filterTagValueMap.get(logTag.tagId);

              // At least one of the tag values specified for this tag filter is included in the current LogTag's value
              for (let i = 0; i < filterTagValuesForTag.length; i++) {
                if (logTag.value === '' || logTag.value.toLowerCase().includes(filterTagValuesForTag[i].value.toLowerCase())) {
                  logTagFulfilled = true;
                  break;
                }
              }
            }
          } else {
            logTagFulfilled = true;
          }

          completeLogTagMap.get(logTag.logId).push(logTag);
          if (logTagFulfilled) {
            fulfilledLogTagMap.get(logTag.logId).push(logTag);
          }
        });

        // Only keep logs for which all queried LogTags were fulfilled
        // FIXME if there are no tags on the log, currently, it is not filtered out.
        logs = logs.filter(log => {
          console.info('Log fulfilled vs complete', log.id, fulfilledLogTagMap.get(log.id), completeLogTagMap.get(log.id));
          return !fulfilledLogTagMap.has(log.id) && !completeLogTagMap.has(log.id) ||
            fulfilledLogTagMap.get(log.id).length === completeLogTagMap.get(log.id).length;
        });

        // Mark the current logs as highlighted since they are the search results and keep their IDs in logIds
        logIds = logs.map(log => {
          log.highlight = true;
          return log.id;
        });

        // Add Execution to tree as root node
        if (logs.length > 0) {
          logs.unshift(new Log(this.execution.id, null, null, this.execution.title,
            this.execution.message, 0));
        }

        // Find the missing parent logs in the database recursively (tangential promise chain)
        return this.recursiveFindLogParents(logs, logs, logIds);
      }).then((returnedLogs: Log[]) => {
        console.log('Returned Logs', returnedLogs);

        logs = returnedLogs;

        // Perform "joins" on the log properties
        logs.forEach(log => {
          log.status = this.statusMap.get(log.statusId) || null;
          log.logTags = completeLogTagMap.get(log.id) || [];
        });

        // Set current logs to update data-binded tree
        this.viewLogs = logs;
      }).catch(reject => {
        console.error(reject);
        alert('An error occurred while searching the logs. Please view the console for more details.');
      });
    } else {

      // Clear tags and statuses from the previous selected execution
      this.allTags = [];
      this.tagMap.clear();
      this.allStatuses = [];
      this.statusMap.clear();
    }
  }

  setActiveLog(activeLog: Log) {
    this.activeLog = activeLog;
  }

  ngOnInit() {
    this.fetchFilterData();
  }

  /**
   * Recursive Promise function which searches for the missing parents and only fulfills when there are none left.
   * @param {Log[]} searchLogs The logs which need to be searched for missing parents.
   * @param {Log[]} allLogs All of the logs which are to be displayed when done.
   * @param {number[]} allLogIds Log IDs for the above.
   * @returns {any} A Promise if there are still parents, otherwise all logs.
   */
  private recursiveFindLogParents(searchLogs: Log[], allLogs: Log[], allLogIds: number[]) {
    const missingIds: number[] = [];

    // Go through all logs and find the missing parents
    searchLogs.forEach(log => {
      if (log.parentId !== 0 && log.parentId !== null && !allLogIds.includes(log.parentId) && !missingIds.includes(log.parentId)) {
        missingIds.push(log.parentId);
      }
    });

    console.info('Missing IDs', missingIds);

    // Stop condition : when there are no more missing parent IDs, return all the queried logs
    if (missingIds.length === 0) {
      return allLogs;
    }

    // Find logs corresponding to missing parent IDs
    return this.db.logs.where(':id').anyOf(missingIds).toArray().then(missingLogs => {
      allLogs = allLogs.concat(missingLogs);
      allLogIds = allLogIds.concat(missingLogs.map(missingLog => missingLog.id));
      return this.recursiveFindLogParents(missingLogs, allLogs, allLogIds);
    });
  }

}
