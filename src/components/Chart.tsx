"use server";

import * as d3 from "d3";
import { JSDOM } from "jsdom";

const { document } = new JSDOM("").window;
global.document = document;

interface DataPoint {
  timestamp: number;
  value: number;
}

export async function renderChart(data: DataPoint[]) {
  // Declare the chart dimensions and margins.
  const width = 940;
  const height = 760;
  const margin = 20;

  const svg = d3
    .create("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin + margin} ${height + margin + margin}`,
    );

  const wrapper = svg
    .append("g")
    .attr("transform", `translate(${margin},${margin})`);

  const x = d3
    .scaleUtc()
    .domain(d3.extent(data, (d) => new Date(d.timestamp)) as [Date, Date])
    .range([0, width]);

  wrapper
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(7));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.value) as [number, number])
    .range([height, 0]);

  wrapper.append("g").call(d3.axisLeft(y).ticks(5));

  // Add the line
  wrapper
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 10)
    .attr(
      "d",
      d3
        .line<DataPoint>()
        .curve(d3.curveMonotoneX)
        .x((d) => x(d.timestamp))
        .y((d) => y(d.value)),
    );

  // Remove all text elements as they're not supported by satori
  svg.selectAll("text").each(function (d, i, nodes) {
    const textNode = d3.select(this);
    // const x = textNode.attr("x");
    // const y = textNode.attr("y");
    // const text = textNode.text();

    // // @ts-ignore
    // d3.select(this.parentNode)
    //   .append("div")
    //   .style("top", y)
    //   .style("left", x)
    //   .text(text);

    textNode.remove();
  });

  return svg.node()?.outerHTML;
}
