//Width and height
var w = 900;
var h = 450;

var rootNode = {"name": "A1","children": [{"name": "A2","children":[{"name":"B3"}]}]};
//var data = [rootNode];

//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var linksGroup = svg.append("g").attr("class", "links");
var nodesGroup = svg.append("g").attr("class", "nodes");
var nodelLabelsGroup = svg.append("g").attr("class", "nodeLabels");


var clusterLayout = d3.tree()
  .size([400, 200])

//
var newD = {"name": rootNode.name + " *","parent": rootNode};
    if (rootNode.children) rootNode.children.push(newD); else rootNode.children = [newD];
    //data.push(newD);
//

function update() {
    
    var root = d3.hierarchy(rootNode);
    d3.selectAll('text.nodeLabel').remove();
    d3.select('svg g.nodes').selectAll('circle.node').remove();
    d3.select('svg g.links').selectAll('line.link').remove();

    console.log(root.descendants());
    clusterLayout(root);

    // Nodes
    let nodes = d3.select('svg g.nodes')
    .selectAll('circle.node')
    .data(root.descendants());

    nodes.enter()
    //.merge(d3.selectAll('circle.node'))
    .append('circle')
        .classed('node', true)
        .attr('cx', function(d) {return d.x;})
        .attr('cy', function(d) {return d.y;})
        .attr('r', 10)
        .on('click',blobClick);

    nodes.exit().remove();

    // Node Labels
    let nodeLabels = d3.select('svg g.nodeLabels')
    .selectAll('label.node')
    .data(root.descendants());

    nodeLabels.enter()
    //.merge(d3.selectAll('label.node'))
    .append("text")
        .classed('nodeLabel', true)
        .attr("x", function(d) { return d.x })
        .attr("y", function(d) { return d.data.children ? d.y - 10 : d.y + 10 })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.name; })
        .style("fill-opacity", 1)
        .style("text-anchor", "middle");

    nodeLabels.exit().remove();

    // Links
    let links = d3.select('svg g.links')
    .selectAll('line.link')
    .data(root.links());

    links.enter()
    //.merge(d3.selectAll('line.link'))
    .append('line')
    .classed('link', true)
    .attr('x1', function(d) {return d.source.x;})
    .attr('y1', function(d) {return d.source.y;})
    .attr('x2', function(d) {return d.target.x;})
    .attr('y2', function(d) {return d.target.y;});

    links.exit().remove();
}

function blobClick(d,i) {
    let parent = d.data;
    console.log('clicked:');
    
    var newD = {"name": parent.name + " *","parent": parent};
    if (parent.children) parent.children.push(newD); else parent.children = [newD];
    //data.push(newD);

    console.log(d);
    //console.log("data:");
    //console.log(data);
    console.log("root:");
    console.log(rootNode);

    update();
}

update();