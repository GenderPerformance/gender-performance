import * as d3 from 'd3'

// create svg element
export function xAxis(elem, xMin, xMax, valMin, valMax) {
  let fontsize
  xMax>300?fontsize = xMax/40:fontsize = xMax/20

  var svg = d3
    .select(elem)
    .append('svg')
    .attr('width', xMax + 30)
    .attr('height', 60)
    .style("font-size",`${fontsize}px`) //dynamically adjust label size

  // Create the scale
  var x = d3
    .scaleLinear()
    .domain([valMin, valMax]) // This is what is written on the Axis: from 0 to 100
    .range([xMin, xMax]) // This is where the axis is placed: from 100px to 800px

  // Draw the axis
  svg
    .append('g')
    .attr('transform', 'translate(10,20)') // This controls the vertical position of the Axis
    .call(d3.axisBottom(x)
    .ticks(40))

  svg
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', xMax/2)
    .attr('y', 50)
    .text('Frequency (Hz)')

  const ticks = d3.selectAll(".tick text")

  ticks.each(function(_,i){
    if(i%5!==0)d3.select(this).remove()
  })
}
