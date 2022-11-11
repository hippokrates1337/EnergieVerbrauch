<script lang="ts">
    import * as d3 from "d3";
    import DateXAxis from "./DateXAxis.svelte";
    import ValueYAxis from "./ValueYAxis.svelte";
    import Legend from "./Legend.svelte";

    export let chartData: ChartData;
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

    for(const c of chartData.data.filter(d => d.type == type)) {
        let i = 0;
        for(const d of c.values) {
            console.log(new Date(chartData.startDate.getTime() + i * 24 * 60 * 60 * 1000));
            console.log(d);
            i++;
        }
    } 
</script>

{#if chartData.days > 0}
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
            {#each chartData.data.filter(d => d.type == type) as dataset, i}
                {#each dataset.values as datapoint, j}
                <circle 
                        cx={xScale(new Date(chartData.startDate.getTime() + j * 24 * 60 * 60 * 1000))}
                        cy={yScale(datapoint)}
                        r="4"
                        style={"fill: " + colorScale(i) + "; stroke-width: 3"}></circle>
                
                <!--        
                <line x1={xScale(new Date(obs.startDate))} x2={xScale(new Date(obs.endDate))} 
                            y1={yScale(obs.value / ((new Date(obs.endDate).getTime() - new Date(obs.startDate).getTime()) / (24 * 60 * 60 * 1000)))} 
                            y2={yScale(obs.value / ((new Date(obs.endDate).getTime() - new Date(obs.startDate).getTime()) / (24 * 60 * 60 * 1000)))} 
                            style={"stroke: " + colorScale(i) + "; stroke-width: 3"} />
                            -->
                {/each}
            {/each}
        </g>

        <!-- Legend 
        <g transform={`translate(${width - padding.right - width * 0.25}, ${padding.top * 1.1})`}>
            <Legend width={width * 0.2} height={obsUnits.length * height * 0.05} 
                entries={obsUnits.map(e => e.name)} {colorScale} />
        </g>
        -->
    </svg>
{/if}