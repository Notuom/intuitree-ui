///<reference path="../../../../node_modules/@types/d3-selection/index.d.ts"/>
import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Log} from '../../shared/domain/log';
import * as d3 from 'd3';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit, OnChanges {

  // String constants
  static readonly svgSelector = "svg#treeRender";
  static readonly listViewMode = 'list';
  static readonly treeViewMode = 'tree';

  // TODO taken directly from example
  private margin = {top: 30, right: 20, bottom: 30, left: 20};
  private width = 960;
  private barHeight = 20;
  private barWidth = (this.width - this.margin.left - this.margin.right) * 0.8;
  private i = 0;
  private duration = 400;
  private diagonal = d3.linkHorizontal()
    .x((d: any) => d.y)
    .y((d: any) => d.x);
  private svg;
  private root;
  // END

  @Input() mode = TreeViewComponent.listViewMode;
  @Input() logs: Log[] = [];

  constructor() {
  }

  ngOnInit() {
    this.svg = d3.select(TreeViewComponent.svgSelector)
      .attr("width", this.width) // + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    this.render();
  }

  ngOnChanges() {
    this.render();
  }

  render() {

    // List render based on https://bl.ocks.org/mbostock/1093025

    // Stratify data into hierarchical format using default D3 function (.id and .parentId)
    if (this.logs.length > 0) {
      console.info("Render called", this.logs);

      this.root = d3.stratify()(this.logs);
      this.root.x0 = 0;
      this.root.y0 = 0;

      this.update(this.root);
    }
  }

  update(source) {

    // Compute the flattened node list.
    const nodes = this.root.descendants();

    console.info("Nodes", nodes);

    const height = nodes.length * this.barHeight + this.margin.top + this.margin.bottom;

    d3.select("svg").transition()
      .duration(this.duration)
      .attr("height", height);

    d3.select(self.frameElement).transition()
      .duration(this.duration)
      .style("height", height + "px");

    // Compute the "layout". TODO https://github.com/d3/d3-hierarchy/issues/67
    let index = -1;
    this.root.eachBefore(n => {
      n.x = ++index * this.barHeight;
      n.y = n.depth * 20;
    });

    // Update the nodes…
    const node = this.svg.selectAll(".node")
      .data(nodes, (d: any) => d.id || (d.id = ++this.i));

    const nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", d => "translate(" + source.y0 + "," + source.x0 + ")")
      .style("opacity", 0);

    // Enter any new nodes at the parent's previous position.
    nodeEnter.append("rect")
      .attr("y", -this.barHeight / 2)
      .attr("height", this.barHeight)
      .attr("width", this.barWidth)
      .style("fill", TreeViewComponent.color)
      .on("click", this.click.bind(this));

    nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      .text(d => d.data.title);

    // Transition nodes to their new position.
    nodeEnter.transition()
      .duration(this.duration)
      .attr("transform", d => "translate(" + d.y + "," + d.x + ")")
      .style("opacity", 1);

    node.transition()
      .duration(this.duration)
      .attr("transform", d => "translate(" + d.y + "," + d.x + ")")
      .style("opacity", 1)
      .select("rect")
      .style("fill", TreeViewComponent.color);

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
      .duration(this.duration)
      .attr("transform", d => "translate(" + source.y + "," + source.x + ")")
      .style("opacity", 0)
      .remove();

    // Update the links…
    const link = this.svg.selectAll(".link")
      .data(this.root.links(), (d: any) => d.target.id);

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", d => {
        const o: any = {x: source.x0, y: source.y0};
        return this.diagonal({source: o, target: o});
      })
      .transition()
      .duration(this.duration)
      .attr("d", this.diagonal);

    // Transition links to their new position.
    link.transition()
      .duration(this.duration)
      .attr("d", this.diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(this.duration)
      .attr("d", d => {
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

  private click(d: any) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d);
  }

  private static color(d) {
    return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
  }
}
