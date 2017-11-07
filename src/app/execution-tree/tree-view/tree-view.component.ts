import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Log} from '../../shared/domain/log';
import * as d3 from 'd3';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit, OnChanges {

  static readonly listViewMode = 'list';
  static readonly treeViewMode = 'tree';

  @Input() mode = TreeViewComponent.listViewMode;
  @Input() logs: Log[] = [];

  constructor() {
  }

  ngOnInit() {
    this.renderTree();
  }

  ngOnChanges() {
    this.renderTree();
  }

  renderTree() {
    if (!this.logs) {
      return;
    }

    // Stratify data into hierarchical format using default D3 function (.id and .parentId)
    const root = d3.stratify()(this.logs);

    // Select DOM root element
    const div = d3.select('#treeRender');

    // Remove previous visualization
    div.selectAll('ul').remove();

    // Create new container for tree elements
    const ul = div.append('ul');

    // Bind data to list
    const node = ul.selectAll('li')
      .data(root.descendants())
      .enter().append('li')
      .style('margin-left', d => d.depth * 2 + 'rem')
      .text(d => (<Log>d.data).title)
      .attr('title', d => (<Log>d.data).message);

    console.log('Root', root);
  }

}
