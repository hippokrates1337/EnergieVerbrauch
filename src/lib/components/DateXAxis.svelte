<script lang="ts">
    import dayjs from "dayjs";

    export let innerWidth: number, innerHeight: number;
    export let tickSize: number;
    export let xScale: d3.ScaleTime<unknown, unknown, unknown>;
</script>

<line x1="0" x2={innerWidth} y1={innerHeight} y2={innerHeight} style="stroke: black" />
{#each xScale.ticks() as tickValue}
<g transform={`translate(${xScale(tickValue)}, 0)`}>
    <line x1="0" x2="0" y1={innerHeight} y2={innerHeight + tickSize} style="stroke: black" />
    <text text-anchor="middle" dy="1em" y={innerHeight + tickSize} style="font-size: 0.5em">
        {dayjs(tickValue).format("DD-MM-YY")}
    </text>
</g>
{/each}