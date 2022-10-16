<script lang="ts">
    import * as d3 from "d3";
    import dayjs from "dayjs";

    export let innerWidth: number, innerHeight: number;
    export let startDate: Date, endDate: Date;
    export let leftPadding: number, topPadding: number;
    export let tickSize: number;

    // Set up axes
    $: xScale = d3.scaleTime().domain([new Date(startDate), new Date(endDate)]).range([0, innerWidth]).nice(d3.timeDay);
</script>

<g transform={`translate(${leftPadding}, ${topPadding})`}>
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