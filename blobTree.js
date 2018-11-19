//Width and height
var w = 900;
var h = 450;

var currentBlob = null;

//mode
var treeMode = true;
function toggleTree() {
    treeMode = !treeMode;
    update();
}

var rootNode = {"name": "A1","children": [{"name": "A2","children":[{"name":"B3"}]}]};
var data = [rootNode];

//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var linksGroup = svg.append("g").attr("class", "links");
var nodesGroup = svg.append("g").attr("class", "nodes");
var nodelLabelsGroup = svg.append("g").attr("class", "nodeLabels");

var treeLayout = d3.tree().size([w - 50, h - 50])
var clusterLayout = d3.cluster().size([w - 50, h - 50])

//
var newD = {"name": rootNode.name + " *","parent": rootNode};
    if (rootNode.children) rootNode.children.push(newD); else rootNode.children = [newD];
    //data.push(newD);
//

function update() {

    let radius = 10;
    
    var root = d3.hierarchy(rootNode);
    d3.selectAll('text.nodeLabel').remove();
    d3.select('svg g.nodes').selectAll('circle.node').remove();
    d3.select('svg g.links').selectAll('line.link').remove();

    console.log(root.descendants());
    if(treeMode) treeLayout(root)
    else clusterLayout(root);

    // Nodes
    let nodes = d3.select('svg g.nodes')
    .selectAll('circle.node')
    .data(root.descendants());

    nodes.enter()
    //.merge(d3.selectAll('circle.node'))
    .append('circle')
        .classed('node', true)
        .attr('cx', function(d) {return d.x;})
        .attr('cy', function(d) {return d.y + radius;})
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
        .attr("y", function(d) { return d.data.children ? d.y : d.y + 3 * radius })
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
    .attr('y1', function(d) {return d.source.y + radius;})
    .attr('x2', function(d) {return d.target.x;})
    .attr('y2', function(d) {return d.target.y + radius;});

    links.exit().remove();
}

function blobClick(d,i) {
    currentBlob = d.data;
    showBlobModal();
}

function addChild(parent,childName)
{
    console.log('adding child:')
    var newD = {"name": childName,"parent": parent};
    if (parent.children) parent.children.push(newD);
    else parent.children = [newD];
    data.push(newD);
    console.log(newD);
    return newD;
}

function removeChild(parent,child)
{
    parent.children.splice(child);
}

function changeBlobName(blob)
{
    var newName = prompt("Edit Name:", blob.name);
    if (newName != null && newName != "") {
        blob.name = newName;
    }

    return blob.name;
}

function updateBlob(d,updates) {
    let parent = d.data;
    let changed = false;

    if (parent.children && parent.children.length > 0) {
        // children with name changes
        if (updates.changedChildren.length > 0)
        {
            for (var i = 0; i < updates.changedChildren.length; ++i) {
                let index = updates.changedChildren[i].index;
                let newName = updates.changedChildren[i].name;
                if(parent.children.length < index) {
                    parent.children[index].name = newName;
                    changed = true;
                }
            }
        }
    }

    // new Children to be added
    if ( updates.newChildren.length > 0) {
        for (var i = 0; i < updates.newChildren.length; ++ i) addChild(parent,updates.newChildren[i]);
        changed = true;
    }

    if(changed) update();
}

update();