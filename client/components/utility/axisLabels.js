import * as d3 from 'd3'

// create svg element
export function xAxis(elem, xMin, xMax, valMin, valMax) {
  var svg = d3
    .select(elem)
    .append('svg')
    .attr('width', xMax + 30)
    .attr('height', 60)

  // Create the scale
  var x = d3
    .scaleLinear()
    .domain([valMin, valMax]) // This is what is written on the Axis: from 0 to 100
    .range([xMin, xMax]) // This is where the axis is placed: from 100px to 800px

  // Draw the axis
  svg
    .append('g')
    .attr('transform', 'translate(10,20)') // This controls the vertical position of the Axis
    .call(d3.axisBottom(x))

  svg
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', 300)
    .attr('y', 50)
    .text('Frequency (Hz)')
}
