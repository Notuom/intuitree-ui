import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output} from '@angular/core';
import {Log} from '../../shared/domain/log';
import * as d3 from 'd3';
import {HierarchyNode} from 'd3-hierarchy';
import {Status} from '../../shared/domain/status';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnChanges {

  @Input() logs: Log[] = [];
  @Output() detailsToggled = new EventEmitter<Log>();

  // D3 list-related variables
  private margin = {top: 12, right: 2, bottom: 2, left: 2};
  private elementWidth: number;
  private barHeight = 20;
  private barWidth: number;
  private currentLogIndex = 0;
  private duration = 400;
  private diagonal = d3.linkHorizontal()
    .x((d: any) => d.y)
    .y((d: any) => d.x);
  private svg: any;
  private svgGroup: any;
  private root: any;

  // Log which is sent to the parent component to show its details
  private activeLog: Log = null;

  private static color(d: HierarchyNode<Log>) {
    return d.data.status !== null ? d.data.status.color : Status.defaultColor;
  }

  constructor(private el: ElementRef) {
  }

  /**
   * When window is resized and the width changes, re-render tree with the new width.
   */
  @HostListener('window:resize')
  onResize() {
    if (this.elementWidth !== this.el.nativeElement.offsetWidth) {
      this.elementWidth = this.el.nativeElement.offsetWidth;
      // TODO see if there is a cleaner way to do this, but this seems to work.
      this.svgGroup.selectAll('g, path').remove();
      this.render();
    }
  }

  /**
   * When data-binded attributes change, re-render with the new data.
   */
  ngOnChanges() {
    this.elementWidth = this.el.nativeElement.offsetWidth;
    // Only render if there are logs, otherwise this component will not be shown (see ngIf on parent component).
    if (this.logs.length > 0) {
      this.render();
    }
  }

  /**
   * Render the current tree as a list via D3.
   */
  render() {

    // List render based on https://bl.ocks.org/mbostock/1093025
    this.svg = d3.select('svg#treeRender');
    this.svgGroup = d3.select('g#treeRenderRootGroup')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // Stratify data into hierarchical format using default D3 function (.id and .parentId)
    if (this.logs.length > 0) {
      this.root = d3.stratify()(this.logs);
      this.root.x0 = 0;
      this.root.y0 = 0;

      this.update(this.root);
    }
  }

  /**
   * Update the current list via D3. Can be called from root or any parent when clicked.
   * @param source
   */
  update(source) {
    this.barWidth = this.elementWidth * 0.4;

    // Compute the flattened node list.
    const nodes = this.root.descendants();

    console.info('Nodes received when updating', nodes);
    const height = nodes.length * this.barHeight + this.margin.top + this.margin.bottom;

    d3.select('svg').transition()
      .duration(this.duration)
      .attr('height', height);

    // Compute the "layout". TODO https://github.com/d3/d3-hierarchy/issues/67
    let index = -1;
    this.root.eachBefore(n => {
      n.x = ++index * this.barHeight;
      n.y = n.depth * 20;
    });

    // Update the nodes…
    const node = this.svgGroup.selectAll('.node')
      .data(nodes, (d: any) => d.id || (d.id = ++this.currentLogIndex));

    const nodeEnter = node.enter().append('g')
      .attr('transform', d => 'translate(' + source.y0 + ',' + source.x0 + ')')
      .style('opacity', 0);

    // Enter any new nodes at the parent's previous position.
    nodeEnter.append('rect')
      .attr('y', -this.barHeight / 2)
      .attr('height', this.barHeight)
      .attr('width', this.barWidth)
      .style('fill', TreeViewComponent.color)
      .on('click', this.toggle.bind(this));

    nodeEnter.append('text')
      .attr('dy', 3.5)
      .attr('dx', 5.5)
      .text(d => d.data.title);

    nodeEnter.append('text')
      .attr('class', 'list-toggler')
      .attr('dy', 3.5)
      .attr('dx', this.barWidth - 12)
      .text('\uf069') // Asterisk FontAwesome icon
      .on('click', this.details.bind(this));

    // Transition nodes to their new position.
    nodeEnter.transition()
      .duration(this.duration)
      .attr('transform', d => 'translate(' + d.y + ',' + d.x + ')')
      .style('opacity', 1);

    // Update existing nodes' classes to keep their opacity in sync with the updated data
    nodeEnter.merge(node)
      .attr('class', d => 'node' + ((d.data.highlight === true) ? ' highlight' : ''));

    node.transition()
      .duration(this.duration)
      .attr('transform', d => 'translate(' + d.y + ',' + d.x + ')')
      .style('opacity', 1)
      .select('rect')
      .style('fill', TreeViewComponent.color);

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
      .duration(this.duration)
      .attr('transform', d => 'translate(' + source.y + ',' + source.x + ')')
      .style('opacity', 0)
      .remove();

    // Update the links…
    const link = this.svgGroup.selectAll('.link')
      .data(this.root.links(), (d: any) => d.target.id);

    // Enter any new links at the parent's previous position.
    link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', d => {
        const o: any = {x: source.x0, y: source.y0};
        return this.diagonal({source: o, target: o});
      })
      .transition()
      .duration(this.duration)
      .attr('d', this.diagonal);

    // Transition links to their new position.
    link.transition()
      .duration(this.duration)
      .attr('d', this.diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(this.duration)
      .attr('d', d => {
        const o: any = {x: source.x, y: source.y};
        return this.diagonal({source: o, target: o});
      })
      .remove();

    // Stash the old positions for transition.
    this.root.each(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  private toggle(node: any) {
    console.info('Toggle called', node);

    if (node.children) {
      node._children = node.children;
      node.children = null;
    } else {
      node.children = node._children;
      node._children = null;
    }
    this.update(node);
  }

  private details(node: any) {
    this.activeLog = node.data;
    this.detailsToggled.emit(this.activeLog);
    console.info('Log Details', this.activeLog);
  }

}
