<script lang="ts">
    import * as d3 from "d3";
    import DateXAxis from "./DateXAxis.svelte";
    import ValueYAxis from "./ValueYAxis.svelte";
    import Legend from "./Legend.svelte";

    export let consumers: Consumer[];
    export let readings: Reading[];
    export let title: string;
    export let parentWidth: number;
    export let startDate: Date, endDate: Date;

    // Determine axis parameters
    $: yValues = readings.map(reading => reading.value / ((new Date(reading.endDate).getTime() - new Date(obs.startDate).getTime()) / (24 * 60 * 60 * 1000)));
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

{#if observations.length > 0}
    <svg {width} {height}>
        <!-- Title -->
        <text x={width / 2} y={0.65 * padding.top} text-anchor="middle" class="h3">
            Täglicher Verbrauch an {title} ({observations[0].unit})
        </text>

        <g transform={`translate(${padding.left}, ${padding.top})`}>
            <!-- X-axis -->
            <DateXAxis {xScale} {innerWidth} {innerHeight} {tickSize}/>

            <!-- Y-axis -->
            <ValueYAxis {yScale} {innerHeight} {innerWidth} {tickSize} left={true} />

            <!-- Data line -->
            {#each obsUnits as unit, i}
                {#each observations as obs}
                    {#if obs.obsUnit == unit.uid}
                        <line x1={xScale(new Date(obs.startDate))} x2={xScale(new Date(obs.endDate))} 
                            y1={yScale(obs.value / ((new Date(obs.endDate).getTime() - new Date(obs.startDate).getTime()) / (24 * 60 * 60 * 1000)))} 
                            y2={yScale(obs.value / ((new Date(obs.endDate).getTime() - new Date(obs.startDate).getTime()) / (24 * 60 * 60 * 1000)))} 
                            style={"stroke: " + colorScale(i) + "; stroke-width: 3"} />
                    {/if}
                {/each}
            {/each}
        </g>

        <!-- Legend -->
        <g transform={`translate(${width - padding.right - width * 0.25}, ${padding.top * 1.1})`}>
            <Legend width={width * 0.2} height={obsUnits.length * height * 0.05} 
                entries={obsUnits.map(e => e.name)} {colorScale} />
        </g>
    </svg>
{/if}