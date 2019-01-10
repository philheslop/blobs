//Width and height
var w = 1000;
var h = 600;

var currentBlob = null;
var userName = "Anonymous";

//mode
var treeMode = true;
function toggleTree() {
    treeMode = !treeMode;
    update();
}

//var rootNode = {"name": "A1","children": [{"name": "A2","children":[{"name":"B3"}]}]};
var rootNode = null;
//rootNode = {"name": "newTopicName" };
var data = [];

//Create SVG element
var svg = null;
var xScale = 1.0;
var yScale = 0.8;


var nodeIdCount = 0;

var treeLayout = d3.tree().size([w - 50, h - 50])
var clusterLayout = d3.cluster().size([w - 50, h - 50])

function enterName() {
    var newUserName = prompt("Enter Your Name", userName);
    if (newUserName != null && newUserName != "") {
        userName = newUserName;
        update();
    }
}

function initSvg() {
    svg = d3.select("#svgContainer")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

    d3.select("#svgContainer").attr("align", "center");

    var linksGroup = svg.append("g").attr("class", "links");
    var nodesGroup = svg.append("g").attr("class", "nodes");
    var nodelLabelsGroup = svg.append("g").attr("class", "nodeLabels");
}

function update() {

    document.getElementById("userNameText").innerText = "Hey, " + userName;

    if (rootNode) {
        document.getElementsByClassName("topicDiv")[0].style.display = "none";

        if(!svg) initSvg();

        let radius = 10;    
        var root = d3.hierarchy(rootNode);
        let duration = 1000;

        //console.log(root);

        d3.selectAll('text.nodeLabel').remove();
        d3.select('svg g.nodes').selectAll('circle.node').remove();
        d3.select('svg g.links').selectAll('line.link').remove();

        //console.log(root.descendants());
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
            .classed('leaf', function(d) {return d.data.children ? false : true})
            .attr('cx', function(d) { return d.parent ? d.parent.x * xScale : d.x * xScale;})
            .attr('cy', function(d) { return d.parent ? d.parent.y * yScale: 0;})
            .attr('r', function(d) { return d.data.children ? radius : radius * 1.1})
            .on('click',blobClick)
            .transition()
            .duration(duration)
            .attr('cx', function(d) {return d.x * xScale;})
            .attr('cy', function(d) {return d.y * yScale + radius * 1.5 + radius * 10 * nodeGetSiblingIndex(d);})

        nodes.exit().remove();

        // Node Labels
        let nodeLabels = d3.select('svg g.nodeLabels')
        .selectAll('label.node')
        .data(root.descendants());

        nodeLabels.enter()
        //.merge(d3.selectAll('label.node'))
        .append("text")
            .classed('nodeLabel', true)
            .attr("x", function(d) { return d.x * xScale})
            .attr("y", function(d) { return 0 } )
            .attr("dy", ".35em")
            .text(function(d) { return d.data.name; })
            .style("fill-opacity", 1)
            .style("text-anchor", function(d) { return d.data.children ? "right": "middle"})
            .transition()
            .duration(duration)
            .attr("x", function(d) { return d.data.children ? d.x * xScale + radius : d.x * xScale; })
            .attr('y', function(d) { return d.data.children ? d.y * yScale + radius * 1.5 : d.y * yScale + 3.5 * radius; })

        nodeLabels.exit().remove();

        // Links
        let links = d3.select('svg g.links')
        .selectAll('line.link')
        .data(root.links());

        links.enter()
        //.merge(d3.selectAll('line.link'))
        .append('line')
        .classed('link', true)
        .attr('x1', function(d) {return w/2;})
        .attr('y1', function(d) {return h/2;})
        .attr('x2', function(d) {return w/2;})
        .attr('y2', function(d) {return h/2;})
        .transition()
        .duration(duration / 2)
        .attr('x1', function(d) {return d.source.x * xScale;})
        .attr('y1', function(d) {return d.source.y * yScale + radius;})
        .attr('x2', function(d) {return d.target.x * xScale;})
        .attr('y2', function(d) {return d.target.y * yScale + radius;})
        
        links.exit().remove();
    } else {
        document.getElementsByClassName("topicDiv")[0].innerHTML = "<h1>No Topic</h1>";
        document.getElementsByClassName("topicDiv")[0].style.textAlign = "center";
        document.getElementsByClassName("topicDiv")[0].style.display = "block";
    }
}

function blobClick(d,i) {
    currentBlob = d.data;
    showBlobModal();
}

function addChild(parent,childName)
{
    console.log('adding child:')
    var newD = {"name": childName,"parentID": parent.id, "id": nodeIdCount};
    nodeIdCount++;
    if (parent.children) parent.children.push(newD);
    else parent.children = [newD];
    data.push(newD);
    //console.log(newD);
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

function nodeGetSiblingIndex(node)
{
    console.log("node");
    console.log(node);
    let parent = node.parent;
    if(parent) {
        console.log("parent");
        console.log(parent);
        for(var i = 0; i < parent.children.length; ++i) {
            let element = parent.children[i];
            if (node === element) {
                return i;
            }
        };
    }
    return 0;
}

function newTopic() {
    var newTopicName = prompt("New Topic", "Car");
    if (newTopicName != null && newTopicName != "") {
        rootNode = {"name": newTopicName, "id": nodeIdCount};
        nodeIdCount++;
        data = [rootNode];
        update();
    }
}

function submit() {
    var xhr = new XMLHttpRequest();
    var url = "http://10.68.33.65:3000/treelogs";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("accept", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 /*&& xhr.status === 200*/) {
            var json = JSON.parse(xhr.responseText);
            console.log("Response:")
            console.log(json);
        }
    };

    var dataObj = {"userName": "ted", "userId": "flappy", "topic": rootNode.name, "action": "test", "tree": rootNode};
    var data = JSON.stringify(dataObj);

    console.log(data);
    xhr.send(data);
}

update();