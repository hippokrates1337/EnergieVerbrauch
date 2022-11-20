<script lang="ts">
    import * as d3 from "d3";
    import DateXAxis from "./DateXAxis.svelte";
    import ValueYAxis from "./ValueYAxis.svelte";
    import Legend from "./Legend.svelte";

    export let chartData: ChartData;
    export let consumers: Consumer[];
    export let type: string;
    export let title: string;
    export let parentWidth: number;

    const getMinValue = (data) => {
        let minValue = 9999;
        for(const consumer of data) {
            let temp = consumer.values.sort((a, b) => a - b)[0];
            if(temp < minValue) minValue = temp;
        }

        return minValue;
    }

    const getMaxValue = (data) => {
        let maxValue = -9999;
        for(const consumer of data) {
            let temp = consumer.values.sort((a, b) => b - a)[0];
            if(temp > maxValue) maxValue = temp;
        }

        return maxValue;
    }

    // Determine axis parameters
    $: minValue = getMinValue(chartData.data.filter(d => d.type == type));
    $: maxValue = getMaxValue(chartData.data.filter(d => d.type == type));

    // Define SVG dimensions
    $: width = parentWidth;
    const height = 480;
    const padding = {top: 35, bottom: 20, left: 25, right: 25};
    const innerHeight = height - padding.top - padding.bottom;
    $: innerWidth = width - padding.left - padding.right;
    const tickSize = 5;
    const yAxisMargin = 0.2;

    // Set up axes
    $: xScale = d3.scaleTime().domain([new Date(chartData.startDate), new Date(chartData.endDate)]).range([0, innerWidth]).nice(d3.timeDay);
    $: yScale = d3.scaleLinear().domain([minValue * (1 - yAxisMargin), maxValue * (1 + yAxisMargin)]).range([innerHeight, 0]).nice();
    $: colorScale = d3.scaleSequential().domain([0, chartData.data.filter(d => d.type == type).length]).interpolator(d3.interpolateViridis);
    
    // Filter the chart data set on the type of consumption to be shown in the chart and keep only date and
    // consumption values; the filter at the end avoids ending up with an array that has several "undefined"
    // child-arrays in it for the types of consumption not shown in the chart
    $: lineData = chartData.data.map((dataset) => {
            if(dataset.type == type) {
                return dataset.values.map((d, i) => [new Date(chartData.startDate.getTime() + i * 24 * 60 * 60 * 1000), d]);
            }
        }).filter((d) => d);

    let lineFunc = d3.line()
                .x((d) => xScale(d[0]))
                .y((d) => yScale(d[1]))
                .curve(d3.curveStep);
</script>

{#if chartData && chartData.days > 0 && width}
    <svg {width} {height}>
        <!-- Title -->
        <text x={width / 2} y={0.65 * padding.top} text-anchor="middle" class="h3">
            Täglicher Verbrauch an {title} ({type == "electricity" ? "kWh" : "m3"})
        </text>

        <g transform={`translate(${padding.left}, ${padding.top})`}>
            <!-- X-axis -->
            <DateXAxis {xScale} {innerWidth} {innerHeight} {tickSize}/>

            <!-- Y-axis -->
            <ValueYAxis {yScale} {innerHeight} {innerWidth} {tickSize} left={true} />

            <!-- Data line -->
            {#each lineData as data, i}
                <path d="{lineFunc(data)}" fill="none" stroke="{colorScale(i)}" />
            {/each}
        </g>

        <!-- Legend -->
        <g transform={`translate(${width - padding.right - width * 0.25}, ${padding.top * 1.1})`}>
            <Legend width={width * 0.2} height={consumers.length * height * 0.05} 
                entries={consumers.map(e => e.name)} {colorScale} />
        </g>
        
    </svg>
{/if}