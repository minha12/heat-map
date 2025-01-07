
  const drawGraph = (data, basetemp) => {
  const width = 1400, height = 400, left = 60, top = 50, right = 50, bottom = 100
  const barWidth = width /(data.length /12)
  const barHeight = height /12
  const legendWidth = 300;
  const legendBarWidth = legendWidth / 9;
  const Months = {
    1:'January', 2:'February', 3:'March', 4:'April',
    5:'May', 6:'June', 7:'July', 8:'August', 9:'September',
    10:'October', 11:'November', 12:'December'
  };
  const cols = [
    ["2.8", "#313695"], ["3.9", "#4575b4"], ["5.0", "#74add1"], 
    ["6.1", "#abd9e9"], ["7.2", "#e0f3f8"], ["8.3", "#ffffbf"], 
    ["9.5", "#fee090"], ["10.6", "#ffbc00"], ["11.7", "#ff9e00"],
    ["12.8", "#ff7000"], [undefined, '#ff4000']
  ];
  const fillColor = (val) => {
    val = Number(val.toFixed(1));
    if (val <= cols[0][0]) { return cols[0][1]}
    else if (val <= cols[1][0]) { return cols[1][1]}
    else if (val <= cols[2][0]) { return cols[2][1]}
    else if (val <= cols[3][0]) { return cols[3][1]}
    else if (val <= cols[4][0]) { return cols[4][1]}
    else if (val <= cols[5][0]) { return cols[5][1]}
    else if (val <= cols[6][0]) { return cols[6][1]}
    else if (val <= cols[7][0]) { return cols[7][1]}
    else if (val <= cols[8][0]) { return cols[8][1]}
    else if (val <= cols[9][0]) { return cols[9][1]}
    else { return cols[10][1] }
  }  
  
  const xScale = d3.scaleBand().domain(data.map(d => d.year)).range([0, width])
  const yScale = d3.scaleBand().domain(data.map(d => d.month)).range([height, 0])
  const xAxis = d3.axisBottom(xScale).tickValues(xScale.domain().filter(year => { return year % 10 === 0}))
  const yAxis = d3.axisLeft(yScale).tickFormat(month => Months[month])
  
  const xColors = d3.scaleLinear()
      .domain([0, 9])
      .range([0, legendWidth]);
  
  const colorAxis = d3.axisBottom(xColors) 
      .tickFormat((d, i) => cols[i][0]);
  const displayLabel = d3.select('#graph')
      .append('div')
      .attr('id', 'tooltip');
    
  //console.log(yScale)
  const svg = d3.select('#graph').append('svg')
    .attr('width', width + left + right)
    .attr('height', height + top + bottom)
    .append('g')
    .attr('transform', `translate(${left}, ${top})`)
  
  svg.append('g').attr('transform', `translate(0, ${height})`).call(xAxis).attr('id', 'x-axis').selectAll('text')
    .attr('dx', '-5px')
    .attr('dy', '-5px') 
    .attr('y', 20)
    .attr('x', -20)
    .attr('transform', 'rotate(-45)')
  
  svg.append('g').call(yAxis).attr('id', 'y-axis').attr('transform', `translate(-0.5,0)`) 
  
  svg.selectAll('rect').data(data).enter().append('rect').attr('class', 'cell')
    .attr('x', d => xScale(d.year))
    .attr('y', d => yScale(d.month))
    .attr('width', barWidth)
    .attr('height', barHeight)
    .style('fill', d => fillColor(d.variance + basetemp))
    .attr('data-year', d => d.year)
    .attr('data-month', d => d.month - 1)
    .attr('data-temp', d => d.variance)
    .on('mouseover', (d, i) => {
    displayLabel
      .html(`
            <p>
            ${d.year} - ${Months[d.month]} </br>
            ${(d.variance + basetemp).toFixed(1)} </br>
            ${d.variance < 0 ? d.variance: '+'+d.variance}
            </p>
            `)
      .style('opacity', .9)
      .style('top', (d3.event.pageY + 15) + 'px')
      .style('left', (d3.event.pageX + 10) + 'px')
      //.style('transform', 'translateY(-100px)')
      .attr('data-year', d.year);

  })
    .on('mouseout', (d, i) => {
    displayLabel
      .style('opacity', 0)
  })
  
  const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(0, ${height+75})`);
 
  legend.selectAll('rect')
      .data(cols)
      .enter()
      .append('rect')
      .attr('x', (d, i) => .5 + xColors(i))
      .attr('y', -28)
      .attr('width', legendBarWidth)
      .attr('height', 28)
      .attr('fill', (d, i) => d[1])
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5);
  
   legend.append('g').call(colorAxis)
    .attr('transform', `translate(${legendBarWidth}, 0)`);
  
    
}

const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

d3.json(url, (err, data) => {
  if(err) throw err
  const dataset = data.monthlyVariance
  const basetemp = data.baseTemperature
  //console.log(dataset)
  drawGraph(dataset, basetemp)
})