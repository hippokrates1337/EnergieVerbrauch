<script lang="ts">
    import * as d3 from "d3";
    import DateXAxis from "./DateXAxis.svelte";
    import ValueYAxis from "./ValueYAxis.svelte";
    import Legend from "./Legend.svelte";
	import { hasContext } from "svelte";

    export let summaryData: Map<string, Map<string, object>>;
    export let obsType: string;
    export let title: string;
    export let parentWidth: number;
    export let startDate: Date, endDate: Date;

    // Helper functions
    const getMin = (data: Map<string, Map<string, object>>, type: string, entry: string) => {
        // Not sure this is the best way to do this...
        let minValue = 9999999;
        let minCount = 9999999;

        for(const v of data.values()) {
            if(v.has(type)) {
                if(v.get(type).totalValue / v.get(type).obsCount < minValue) {
                    minValue = v.get(type).totalValue / v.get(type).obsCount;
                }

                if(v.get(type).obsCount < minCount) {
                    minCount = v.get(type).obsCount;
                }
            }
        }

        if(entry == "value") {
            return minValue;
        }

        return minCount;
    }

    const getMax = (data: Map<string, Map<string, object>>, type: string, entry: string) => {
        // Not sure this is the best way to do this...
        let maxValue = 0;
        let maxCount = 0;

        for(const v of data.values()) {
            if(v.has(type)) {
                if(v.get(type).totalValue / v.get(type).obsCount > maxValue) {
                    maxValue = v.get(type).totalValue / v.get(type).obsCount;
                }

                if(v.get(type).obsCount > maxCount) {
                    maxCount = v.get(type).obsCount;
                }
            }
        }

        if(entry == "value") {
            return maxValue;
        }

        return maxCount;
    }

    // Determine axis parameters
    $: minValue = getMin(summaryData, obsType, "value");
    $: maxValue = getMax(summaryData, obsType, "value");
    $: minCount = getMin(summaryData, obsType, "count");
    $: maxCount = getMax(summaryData, obsType, "count");

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
    $: yScaleLeft = d3.scaleLinear().domain([minValue * (1 - yAxisMargin), maxValue * (1 + yAxisMargin)]).range([innerHeight, 0]).nice();
    $: yScaleRight = d3.scaleLinear().domain([minCount * (1 - yAxisMargin), maxCount * (1 + yAxisMargin)]).range([innerHeight, 0]).nice();
    $: colorScale = d3.scaleSequential().domain([0, 2]).interpolator(d3.interpolateViridis);
</script>

{#if summaryData.size > 0}
    <svg {width} {height}>
        <!-- Title -->
        <text x={width / 2} y={0.65 * padding.top} text-anchor="middle" class="h3">
            Täglicher Verbrauch an {title}
        </text>

        <g transform={`translate(${padding.left}, ${padding.top})`}>
            <!-- X-axis -->
            <DateXAxis {xScale} {innerWidth} {innerHeight} {tickSize}/>

            <!-- Y-axis -->
            <ValueYAxis yScale={yScaleLeft} {innerHeight} {innerWidth} {tickSize} left={true} />
            <ValueYAxis yScale={yScaleRight} {innerHeight} {innerWidth} {tickSize} left={false} />
            
            <!-- Data lines -->
            {#each [...summaryData] as [key, value]}
                {#if value.has(obsType)}
                    <circle 
                        cx={xScale(new Date(key))}
                        cy={yScaleLeft(value.get(obsType).totalValue / value.get(obsType).obsCount)}
                        r="4"
                        style={"fill: " + colorScale(0) + "; stroke-width: 3"}></circle>

                        <circle 
                        cx={xScale(new Date(key))}
                        cy={yScaleRight(value.get(obsType).obsCount)}
                        r="4"
                        style={"fill: " + colorScale(1) + "; stroke-width: 3"}></circle>
                {/if}
            {/each}
        </g>

        <!-- Legend -->
        <g transform={`translate(${width - padding.right - width * 0.25}, ${padding.top * 1.1})`}>
            <Legend width={width * 0.2} height={2 * height * 0.05} 
                entries={["Verbrauch (links)", "Beobachtungen (rechts)"]} {colorScale} />
        </g>
    </svg>
{/if}