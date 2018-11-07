//Width and height
var w = 900;
var h = 450;

var dataset = [{'label':'car','history':[]}];
var lastDataIndexClicked = 0;

var xScale = d3.scaleBand()
                .domain(d3.range(dataset.length))
                .rangeRound([0, w])
                .paddingInner(0.5);

var yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset)])
                .range([0, h]);

//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

//Create blobs
svg.selectAll("circle")
   .data(dataset)
   .enter()
   .append("circle")
   .attr("cx", function(d, i) {
           return xScale(i);
   })
   .attr("cy", function(d) {
           return h/2; // - yScale(d);
   })
   .attr("r", xScale.bandwidth())
   //.attr("height", function(d) {
   //		return yScale(d);
   //})
   .attr("fill", function(d) {
        return "rgb(0, 0, " + Math.round(d * 10) + ")";
   })
   .on('click', clicked);

//Create labels
svg.selectAll("text.label")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {
           return d.label;
   })
   .attr("class", "label")
   .attr("text-anchor", "middle")
   .attr("x", function(d, i) {
           return xScale(i) + xScale.bandwidth() / 2;
   })
   .attr("y", function(d) {
           return h /2;// - yScale(d) + 14;
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "white");

function clicked(d,i) {
    //Add one new value to dataset
    lastDataIndexClicked = i;
    let newData = {};
    let newLabel = dataset[lastDataIndexClicked].label + '\'';
    let newDataHistory = d.history.slice();
    newDataHistory.unshift(dataset[lastDataIndexClicked].label);

    newData.label = newLabel;
    newData.history = newDataHistory;

    dataset.push(newData);		 			 	//Add new data to array
    
    console.log(dataset);

    //Update scale domains
    xScale.domain(d3.range(dataset.length));	//Recalibrate the x scale domain, given the new length of dataset
    yScale.domain([0, d3.max(dataset)]);		//Recalibrate the y scale domain, given the new max value in dataset

    //Select…
    var blobs = svg.selectAll("circle")			//Select all blobs
        .data(dataset);	//Re-bind data to existing blobs, return the 'update' selection
                                        //'blobs' is now the update selection					
    //Enter…
    blobs.enter()	//References the enter selection (a subset of the update selection)
        .append("circle")	//Creates a new circle
        .attr("cx", w)		//Initial x position of the circle beyond the right edge of SVG
        .attr("cy", function(d) {	//Sets the y value, based on the updated yScale
            return h / 2;// - yScale(d);
        })
        .attr("r", xScale.bandwidth())	//Sets the width value, based on the updated xScale
        .attr("fill", function(d) {	return "rgb(0, 0, " + Math.round(i * 10) + ")";	})
        .on('click',clicked)
        .merge(blobs)							//Merges the enter selection with the update selection
        .transition()							//Initiate a transition on all elements in the update selection (all circles)
        .duration(500)
        .attr("cx", function(d, i) {				//Set new x position, based on the updated xScale
            return xScale(i);
        })
        .attr("cy", function(d) {				//Set new y position, based on the updated yScale
            return h/2;// - yScale(d);
        })
        .attr("r", xScale.bandwidth())	;	//Set new width value, based on the updated xScale
        //.attr("height", function(d) {			//Set new height value, based on the updated yScale
        //	return yScale(d);
        //});

    //Update all labels
    var labels = svg.selectAll("text.label").data(dataset);

    labels.enter()
    .append("text")
    .text(function(d) {	return d.label;	})
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", function(d) {	return 'white';	})
        .attr("x", function(d, i) {	return w/2 + xScale.bandwidth() / 2; })
        .attr("y", function(d) { return h / 2; }) //if (d < 0.07 * maxValue){	return h - yScale(d) - 7	} //else {	return h - yScale(d) + 14;	}
    .merge(labels)
    .transition()
    .duration(500)
    .attr("x", function(d, i) { //Set new x position, based on the updated xScale
        return xScale(i);
    });

    var historyGroups = svg.selectAll("g")
        .data(dataset)

    historyGroups.enter()
        .append("g")
        .merge(historyGroups)
        //.attr("x", function(d, i) {	return xScale(i) + xScale.bandwidth() / 2; })
        //.attr("y", function(d) { return h; }) //if (d < 0.07 * maxValue){	return h - yScale(d) - 7	} //else {	return h - yScale(d) + 14;	}
        .attr("transform", function(d, i) { var x = xScale(i); return "translate("+ x + "," + h/3 + ")"; })
        //.attr("x", function(d, i) { return xScale(i); })
        .selectAll("text.history")
        .data(function(d) { return d.history; })
        .enter().append("text")
            .text(function(d) { return d })
            .attr("class", "history")
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", function(d) {	return 'red'; })
            .attr("y", function(d, i) { return i * 11; })
            .on("click",historyClick)
            //.attr("x", function(d, i) { return 0; })
            //.transition()
            //.duration(500)
            //.attr("x", function(d, i) { //Set new x position, based on the updated xScale
            //	return xScale(i);
            //});
            //.style("background-color", function(d, i) { return i % 2 ? "#eee" : "#ddd"; })
}

function historyClick(data,index)
{
    console.log('history-clicked');
    console.log(data);

    var historyGroups = svg.selectAll("g")
        .data(dataset)

    historyGroups.enter()
        .merge(historyGroups)
        .selectAll("text.history")
        .data(function(d) { return d.history; })
        .transition()
        .duration(500)
        .attr("fill", function(d) {	if(d==data) return 'green'; return 'red'; })
}