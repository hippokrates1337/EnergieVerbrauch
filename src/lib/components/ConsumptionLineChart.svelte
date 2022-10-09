<script lang="ts">
    import * as d3 from "d3";
    import dayjs from "dayjs";

    export let obsUnits: ObservationUnit[];
    export let observations: Observation[];
    export let title: string;
    export let parentWidth: number;

    // Determine first and last date to show
    $: yValues = observations.map(obs => obs.value / ((new Date(obs.endDate).getTime() - new Date(obs.startDate).getTime()) / (24 * 60 * 60 * 1000)))
    $: startDate = observations.map(obs => obs.startDate).sort((a, b) => (new Date(a) as any) - (new Date(b) as any))[0];
    $: endDate = observations.map(obs => obs.endDate).sort((a, b) => (new Date(b) as any) - (new Date(a) as any))[0];
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
        <!-- X-axis -->
        <g transform={`translate(${padding.left}, ${padding.top})`}>
            <line x1="0" x2={innerWidth} y1={innerHeight} y2={innerHeight} style="stroke: black" />
            {#each xScale.ticks() as tickValue}
            <g transform={`translate(${xScale(tickValue)}, 0)`}>
                <line x1="0" x2="0" y1={innerHeight} y2={innerHeight + tickSize} style="stroke: black" />
                <text text-anchor="middle" dy="1em" y={innerHeight + tickSize} style="font-size: 0.5em">
                    {dayjs(tickValue).format("DD-MM-YY")}
                </text>
            </g>
            {/each}
        </g>

        <!-- Y-axis -->
        <g transform={`translate(${padding.left}, ${padding.top})`}>
            <line x1="0" x2="0" y1="0" y2={innerHeight} style="stroke: black" />
            {#each yScale.ticks() as tickValue}
            <g transform={`translate(0, ${yScale(tickValue)})`}>
                <line x1={-tickSize} x2="0" y1="0" y2="0" style="stroke: black" />
                <text text-anchor="middle" dx="-1.5em" dy="0.4em" style="font-size: 0.5em">
                    {tickValue.toFixed(1)}
                </text>
            </g>
            {/each}
        </g>

        <!-- Data line -->
        {#each obsUnits as unit, i}
            <g transform={`translate(${padding.left}, ${padding.top})`}>
                {#each observations as obs}
                    {#if obs.obsUnit == unit.uid}
                        <line x1={xScale(new Date(obs.startDate))} x2={xScale(new Date(obs.endDate))} 
                            y1={yScale(obs.value / ((new Date(obs.endDate).getTime() - new Date(obs.startDate).getTime()) / (24 * 60 * 60 * 1000)))} 
                            y2={yScale(obs.value / ((new Date(obs.endDate).getTime() - new Date(obs.startDate).getTime()) / (24 * 60 * 60 * 1000)))} 
                            style={"stroke: " + colorScale(i) + "; stroke-width: 3"} />
                    {/if}
                {/each}
            </g>
        {/each}

        <!-- Legend -->
        <g transform={`translate(${width - padding.right - width * 0.2}, ${padding.top * 1.1})`}>
            <rect width={width * 0.2} height={obsUnits.length * height * 0.05}
                style="fill: lightgray" />
            {#each obsUnits as unit, i}
                <line x1={width * 0.02} x2={width * 0.04} 
                    y1={height * 0.025 + i * height * 0.05} y2={height * 0.025  + i * height * 0.05} 
                    style={"stroke: " + colorScale(i) + "; stroke-width: 3"}/>
                <text text-anchor="start" x={width * 0.05} y={height * 0.032  + i * height * 0.05}
                    style="font-size: 0.75em">
                    {unit.name}
                </text>
            {/each}
        </g>
    </svg>
{/if}