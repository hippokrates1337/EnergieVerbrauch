
<script lang="ts">
    import * as d3 from "d3";

    export let minValue: number, maxValue: number;
    export let yAxisMargin: number;
    export let innerHeight: number;
    export let leftPadding: number, topPadding: number;
    export let tickSize: number;    

    // Set up axis
    $: yScale = d3.scaleLinear().domain([minValue * (1 - yAxisMargin), maxValue * (1 + yAxisMargin)]).range([innerHeight, 0]).nice();
</script>

<g transform={`translate(${leftPadding}, ${topPadding})`}>
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