import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Log} from '../../shared/domain/log';
import {Tag} from '../../shared/domain/tag';
import {Annotation} from '../../shared/domain/annotation';
import {DatabaseService} from '../../shared/database/database.service';
import {Status} from '../../shared/domain/status';
import {LogTag} from "../../shared/domain/log-tag";

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.scss']
})
export class LogDetailsComponent implements OnChanges {

  @Input() activeLog: Log = null;
  @Input() allStatuses: Status[] = null;
  @Input() statusMap: Map<number, Status> = null;
  @Input() tagMap: Map<number, Tag> = null;

  @Output() close = new EventEmitter<null>();
  @Output() update = new EventEmitter<null>();

  annotations: Annotation[] = [];
  logTags: LogTag[] = [];

  addingAnnotation = false;
  addAnnotationStatus: Status = null;
  addAnnotationMessage = '';

  constructor(private db: DatabaseService) {
  }

  addAnnotation() {
    this.addingAnnotation = true;
  }

  saveAnnotation() {
    const annotation = new Annotation(this.activeLog.executionId, this.activeLog.id, this.activeLog.statusId, this.addAnnotationStatus.id,
      this.addAnnotationMessage, new Date().getTime());

    // Change instance data
    this.annotations.unshift(annotation);
    this.activeLog.status = this.addAnnotationStatus;

    // Change database data
    this.db.annotations.add(annotation);
    this.db.logs.update(this.activeLog.id, {statusId: this.addAnnotationStatus.id})
      .then(() => this.update.emit());

    this.resetAnnotation();
  }

  resetAnnotation() {
    this.addingAnnotation = false;
    this.addAnnotationStatus = this.activeLog.status;
    this.addAnnotationMessage = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    // Get all annotations and tags related to active log when it changes
    if (changes.hasOwnProperty('activeLog') && changes['activeLog'].currentValue !== null) {
      // Active Log has changed: retrieve its annotations
      this.annotations = [];
      this.resetAnnotation();
      this.db.annotations
        .where('logId').equals(this.activeLog.id).reverse()
        .toArray().then(queriedAnnotations => {
          console.info('Log Annotations', queriedAnnotations);
        this.annotations = queriedAnnotations;
        return this.db.logTags
          .where('logId').equals(this.activeLog.id)
          .toArray();
      }).then(queriedLogTags => {
        this.logTags = queriedLogTags;
      });
    }
  }

}
