
const gdpUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(gdpUrl)
  .then((response) => response.json())
  .then((json) => createBarChart(json));


createBarChart = (json) => {
    
    const dataset = json.data;

    const newDates=[];
    for (let i = 0; i<dataset.length; ++i){
        newDates.push(new Date(dataset[i][0]));
    }
    
    
    const length = 1000;
    const breadth = 490;
    const padding = 50;

    const width = length - 2*padding;
    const height = breadth - 2*padding;
    
    const maxDateMore = new Date (d3.max(newDates, (d) => d));
    const minDateLess = new Date(d3.min(newDates, (d) => d));
    
    const maxValue = d3.max(dataset, (d) => d[1]);
    const adjustedMaxValue = Math.ceil(maxValue/1000)*1000;
    const barWidth = ((width-padding) / (dataset.length+10));

    const yScale = d3.scaleLinear()
        .domain([0,adjustedMaxValue])
        .range([height, 0]); 
        
    const xScale = d3.scaleTime()
        .domain([minDateLess, maxDateMore])
        .range([padding, width]);


    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);	


    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", length)
        .attr("height", breadth);

    svg.append("g")
        .attr("transform", "translate("+padding+",0)")
        .attr("id", "y-axis")
        .call(yAxis);

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis);

    const screenTip = svg.append("text")
    .attr("id", "tooltip")
    .attr("x", 0.5* width - 100)
    .attr("y", height*0.5)
    .attr("opacity", 0.9)
    .attr("stroke", "black");

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(newDates[i]))
        .attr("y", (d, i) => height - yScale(adjustedMaxValue-d[1]))
        .attr("width", () => barWidth) 
        .attr("height", (d, i) => yScale(adjustedMaxValue-d[1]))
        .attr('data-date', (d,i) => (d[0]))
        .attr('data-gdp', (d,i) => (d[1]))
        .attr("fill", "LightGreen")
        .on('mouseover', (d, i) => {
            screenTip.text(d[0] + ": $" + d[1] + " Billions of Dollars")
            .attr('data-date', d[0])
            .attr('opacity', 0.9);
        })
        .on('mouseout', () => screenTip.attr('opacity', 0))
        .append("title")
        .text ((d,i) => d[0] + ": $" + d[1] + " Billions of Dollars")
        .attr("data-date",(d,i) => (d[0]));

}
