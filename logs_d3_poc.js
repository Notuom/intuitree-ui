'use strict';

// SVG Element which will contain graphics
var svg = d3.select("svg"),
    svgBBox = svg.node().getBoundingClientRect(),
    width = parseInt(svgBBox.width, 10),
    height = parseInt(svgBBox.height, 10),
    g = svg.append("g").attr("transform", "translate(40,0)");

// Create Tree Layout
var tree = d3.tree()
    .size([height, width - 160]);

d3.json("logs.json", (error, data) => {
    if (error) throw error;

    console.log(data);

    var root = d3.hierarchy(data, d => d.logs);

    console.log(root);

    var link = g.selectAll(".link")
        .data(tree(root).links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    var node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
        .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

    node.append("circle")
        .attr("r", 2.5);

    node.append("text")
        .attr("dy", 3)
        .attr("x", d => d.children ? -8 : 8)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.title);
});