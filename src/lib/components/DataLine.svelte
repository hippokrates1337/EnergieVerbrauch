<script lang="ts">
    import * as d3 from "d3";

    export let startDate: Date, endDate: Date;

    // Determine axis parameters
    $: yValues = observations.map(obs => obs.value / ((new Date(obs.endDate).getTime() - new Date(obs.startDate).getTime()) / (24 * 60 * 60 * 1000)));
    $: minValue = yValues.sort((a, b) => a - b)[0];
    $: maxValue = yValues.sort((a, b) => b - a)[0];

    // Define SVG dimensions
    $: width = parentWidth;
    const height = 480;
    const padding = {top: 35, bottom: 20, left: 25, right: 25};
    const innerHeight = height - padding.top - padding.bottom;
    $: innerWidth = width - padding.left - padding.right;
    const tickSize = 5;
    const yAxisMargin = 0.2;

    // Set up axes
    $: xScale = d3.scaleTime().domain([new Date(startDate), new Date(endDate)]).range([0, innerWidth]).nice(d3.timeDay);
    $: yScale = d3.scaleLinear().domain([minValue * (1 - yAxisMargin), maxValue * (1 + yAxisMargin)]).range([innerHeight, 0]).nice();
    $: colorScale = d3.scaleSequential().domain([0, obsUnits.length]).interpolator(d3.interpolateViridis);
</script>

<line x1={xScale(new Date(obs.startDate))} x2={xScale(new Date(obs.endDate))} 
    y1={yScale(obs.value / ((new Date(obs.endDate).getTime() - new Date(obs.startDate).getTime()) / (24 * 60 * 60 * 1000)))} 
    y2={yScale(obs.value / ((new Date(obs.endDate).getTime() - new Date(obs.startDate).getTime()) / (24 * 60 * 60 * 1000)))} 
    style={"stroke: " + colorScale(i) + "; stroke-width: 3"} />
