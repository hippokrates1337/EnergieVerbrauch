<script lang="ts">
    export let width: number, height: number;
    export let entries: string[];
    export let colorScale: d3.ScaleSequential<unknown, unknown>;
    export let showBenchmark: boolean = false;

    // Add one extra entry for the benchmark line
    let entryHeight = height / (entries.length + (showBenchmark ? 1 : 0));
</script>

<rect width={width} height={height}
    style="stroke: dimgray; fill: white" />

{#each entries as entry, i}
    <line x1={width * 0.025} x2={width * 0.1} 
        y1={entryHeight / 2 + i * entryHeight} y2={entryHeight / 2 + i * entryHeight} 
        style={"stroke: " + colorScale(i) + "; stroke-width: 3"}/>
    <text text-anchor="start" x={width * 0.125} y={entryHeight / 2 + i * entryHeight + 0.15 * entryHeight}
        style="font-size: 0.75em">
        {entry}
    </text>
{/each}

{#if showBenchmark}
    <line x1={width * 0.025} x2={width * 0.1} 
        y1={entryHeight / 2 + entries.length * entryHeight} y2={entryHeight / 2 + entries.length * entryHeight} 
        style={"stroke: red; stroke-width: 3"}/>
    <text text-anchor="start" x={width * 0.125} y={entryHeight / 2 + entries.length * entryHeight + 0.15 * entryHeight}
        style="font-size: 0.75em">
        Benchmark
    </text>
{/if}