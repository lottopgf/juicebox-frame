"use server";

import * as d3 from "d3";
import { fromUnixTime } from "date-fns";
import { JSDOM } from "jsdom";

const { document } = new JSDOM("").window;
global.document = document;

interface DataPoint {
  timestamp: number;
  value: number;
}

export async function renderChart(data: DataPoint[]) {
  const width = 920;
  const height = 750;
  const margin = 50;

  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${width + margin * 1.5} ${height + margin * 1.5}`);

  const wrapper = svg
    .append("g")
    .attr("transform", `translate(${margin},${margin})`);

  const x = d3
    .scaleUtc()
    .domain(d3.extent(data, (d) => fromUnixTime(d.timestamp)) as [Date, Date])
    .range([0, width])
    .nice();

  const xGroup = wrapper
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom<Date>(x)
        .tickValues(x.ticks(7).concat(x.domain().slice(-1)))
        .tickFormat(d3.utcFormat("%-m/%-d"))
        .tickSizeOuter(0),
    );

  xGroup.selectAll(".tick").each((d, i, nodes) => {
    // @ts-ignore
    const tick = d3.select<SVGGElement>(nodes[i]);
    const textNode = tick.select("text");
    const [, rawX, rawY] =
      tick.attr("transform").match(/translate\(([\d.]*),([\d.]*)\)/) ?? [];
    const text = textNode.text();

    const x = parseFloat(rawX) + margin;
    const y = parseFloat(rawY) + margin + height;

    tick
      .append("div")
      .attr(
        "tw",
        `absolute flex justify-center text-2xl text-center w-[100px] -ml-[50px] mt-[5px] top-[${y}px] left-[${x}px]`,
      )
      .text(text);
    textNode.remove();
  });

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.value) as [number, number])
    .range([height, 0])
    .nice(7);

  const yGroup = wrapper
    .append("g")
    .call(d3.axisLeft(y).ticks(7, ".1~f").tickSizeOuter(0))
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", width)
        .attr("stroke-opacity", 0.2),
    );

  yGroup.selectAll(".tick").each((d, i, nodes) => {
    // @ts-ignore
    const tick = d3.select<SVGGElement>(nodes[i]);
    const textNode = tick.select("text");
    const [, , rawY] =
      tick.attr("transform").match(/translate\(([\d.]*),([\d.]*)\)/) ?? [];
    const text = textNode.text();

    const x = 0;
    const y = parseFloat(rawY) + margin;

    tick
      .append("div")
      .attr(
        "tw",
        `absolute flex justify-end text-2xl text-right w-[50px] -ml-[${margin / 3}px] -mt-[22px] top-[${y}px] left-[${x}px]`,
      )
      .text(text);
    textNode.remove();
  });

  // Add the line
  wrapper
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 12)
    .attr("stroke-linecap", "round")
    .attr(
      "d",
      d3
        .line<DataPoint>()
        .curve(d3.curveMonotoneX)
        .x((d) => x(fromUnixTime(d.timestamp)))
        .y((d) => y(d.value)),
    );

  return svg.node()?.outerHTML;
}
