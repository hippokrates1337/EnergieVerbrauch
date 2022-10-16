
<script lang="ts">
    export let innerHeight: number;
    export let tickSize: number;
    export let yScale: d3.ScaleLinear<unknown, unknown, unknown>;  
</script>

<line x1="0" x2="0" y1="0" y2={innerHeight} style="stroke: black" />
{#each yScale.ticks() as tickValue}
<g transform={`translate(0, ${yScale(tickValue)})`}>
    <line x1={-tickSize} x2="0" y1="0" y2="0" style="stroke: black" />
    <text text-anchor="middle" dx="-1.5em" dy="0.4em" style="font-size: 0.5em">
        {tickValue.toFixed(1)}
    </text>
</g>
{/each}