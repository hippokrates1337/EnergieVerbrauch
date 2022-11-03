
<script lang="ts">
    export let innerHeight: number, innerWidth: number;
    export let tickSize: number;
    export let yScale: d3.ScaleLinear<unknown, unknown, unknown>;
    export let left: boolean;
</script>

{#if left}
<line x1="0" x2="0" y1="0" y2={innerHeight} style="stroke: black" />
{:else}
<line x1={innerWidth} x2={innerWidth} y1="0" y2={innerHeight} style="stroke: black" />
{/if}
{#each yScale.ticks() as tickValue}
<g transform={`translate(0, ${yScale(tickValue)})`}>
    {#if left}
        <line x1={-tickSize} x2="0" y1="0" y2="0" style="stroke: black" />
        <text text-anchor="middle" dx="-1.5em" dy="0.4em" style="font-size: 0.5em">
            {tickValue.toFixed(1)}
        </text>
    {:else}
        <line x1={innerWidth} x2={innerWidth + tickSize} y1="0" y2="0" style="stroke: black" />
        <text text-anchor="middle" dx={innerWidth + 2.5 * tickSize} dy="0.4em" style="font-size: 0.5em">
            {tickValue.toFixed(1)}
        </text>
    {/if}
    
</g>
{/each}