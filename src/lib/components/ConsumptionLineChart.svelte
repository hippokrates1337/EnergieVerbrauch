<script lang="ts">
    import * as d3 from "d3";
    import DateXAxis from "./DateXAxis.svelte";
    import ValueYAxis from "./ValueYAxis.svelte";
    import Legend from "./Legend.svelte";

    export let chartData: ChartData;
    export let benchmarkData: ChartData | undefined = undefined;
    export let consumers: Consumer[] = [];
    export let type: string;
    export let title: string;
    export let explanationText: string;
    export let parentWidth: number;
    export let legend: boolean = true;
    export let showObservations: boolean = false;
    export let leftAxisTitle: string = "";
    export let rightAxisTitle: string = "";

    const getMinValue = (data: ValueSet[]) : {minValue: number, minObs: number} => {
        let minValue = 0;
        let minObs = 0;

        if(data.length == 0) {
            return {
                minValue: 0,
                minObs: 0
            };
        }

        for(const consumer of data) {
            let temp = Math.min(...consumer.values);
            if(temp < minValue) minValue = temp;

            temp = Math.min(...consumer.observations);
            if(temp < minObs) minObs = temp;
        }

        // If benchmark data exists, need to check its range as well
        if(benchmarkData) {
            let temp = benchmarkData.data.filter((d) => d.type == type);
            if(temp[0]) {
                let temp2 = Math.min(...(temp[0].values));
                if(temp2 < minValue) minValue = temp2;
            }
        }

        return {
            minValue: minValue,
            minObs: minObs
        };
    }

    const getMaxValue = (data: ValueSet[]) : {maxValue: number, maxObs: number} => {
        let maxValue = 0;
        let maxObs = 0;

        if(data.length == 0) {
            return {
                maxValue: 0,
                maxObs: 0
            };
        }

        for(const consumer of data) {
            let temp = Math.max(...consumer.values);
            if(temp > maxValue) maxValue = temp;

            temp = Math.max(...consumer.observations);
            if(temp > maxObs) maxObs = temp;
        }

        // If benchmark data exists, need to check its range as well
        if(benchmarkData) {
            let temp = benchmarkData.data.filter((d) => d.type == type);
            if(temp[0]) {
                let temp2 = Math.max(...(temp[0].values));
                if(temp2 > maxValue) maxValue = temp2;
            }
        }

        return {
            maxValue: maxValue,
            maxObs: maxObs
        };
    }

    // Determine axis parameters
    $: minValue = (getMinValue(chartData.data ? chartData.data.filter(d => d.type == type) : [])).minValue;
    $: maxValue = (getMaxValue(chartData.data ? chartData.data.filter(d => d.type == type) : [])).maxValue;
    $: minObs = (getMinValue(chartData.data ? chartData.data.filter(d => d.type == type) : [])).minObs;
    $: maxObs = (getMaxValue(chartData.data ? chartData.data.filter(d => d.type == type) : [])).maxObs;
    

    // Define SVG dimensions
    $: width = parentWidth;
    const height = 480;
    const padding = {top: 35, bottom: 20, left: 35, right: 35};
    const innerHeight = height - padding.top - padding.bottom;
    $: innerWidth = width - padding.left - padding.right;
    const tickSize = 7;
    const yAxisMargin = 0.2;

    // Set up axes
    $: xScale = d3.scaleTime().domain([new Date(Math.min(chartData.startDate ? chartData.startDate.valueOf()  : (new Date()).valueOf(), 
                benchmarkData ? benchmarkData.startDate.valueOf() : (new Date()).valueOf())), 
                new Date(Math.max(chartData.endDate ? chartData.endDate.valueOf() : (new Date()).valueOf(), 
                benchmarkData ? benchmarkData.endDate.valueOf() : (new Date()).valueOf()))])
                .range([0, innerWidth]).nice(d3.timeDay);
    $: yScale = d3.scaleLinear().domain([minValue * (1 - yAxisMargin), maxValue * (1 + yAxisMargin)]).range([innerHeight, 0]).nice();
    $: yScaleRight = d3.scaleLinear().domain([minObs * (1 - yAxisMargin), maxObs * (1 + yAxisMargin)]).range([innerHeight, 0]).nice();
    $: colorScale = d3.scaleSequential().domain([0, chartData.data ? chartData.data.filter(d => d.type == type).length : 0]).interpolator(d3.interpolateRgb('blue', 'green'));
    
    // Filter the chart data set on the type of consumption to be shown in the chart and keep only date and
    // consumption values; the filter at the end avoids ending up with an array that has several "undefined"
    // child-arrays in it for the types of consumption not shown in the chart
    $: lineData = chartData.data ? chartData.data.map((dataset) => {
            if(dataset.type == type) {
                return dataset.values.map((d, i) => [new Date(chartData.startDate.getTime() + i * 24 * 60 * 60 * 1000), d]);
            }
        }).filter((d) => d) : [];

    $: benchmarkLineData = benchmarkData ? benchmarkData.data.map((dataset) => {
            if(dataset.type == type) {
                return dataset.values.map((d, i) => [new Date(benchmarkData.startDate.getTime() + i * 24 * 60 * 60 * 1000), d]);
            }
        }).filter((d) => d) : undefined;

    let lineFunc = d3.line()
                .x((d) => xScale(d[0]))
                .y((d) => yScale(d[1]))
                .curve(d3.curveBasis);

    // Set up data line for observations
    $: obsLineDate = chartData.data ? chartData.data.map((dataset) => {
            if(dataset.type == type) {
                return dataset.observations.map((d, i) => [new Date(chartData.startDate.getTime() + i * 24 * 60 * 60 * 1000), d]);
            }
        }).filter((d) => d) : [];

    let obsLineFunc = d3.line()
                .x((d) => xScale(d[0]))
                .y((d) => yScaleRight(d[1]))
                .curve(d3.curveBasis);

    // Generate a list of dates on which meter readings where entered so these can be marked in the graph
    $: readingsDates = chartData.data ? chartData.data.map((dataset) => {
            if(dataset.type == type) {
                return dataset.readingsDates;
            }
        }).filter((d) => d) : [];
</script>

{#if chartData && lineData.length > 0 && width}
    <div class="card p-2">
        <div class="card-header">
            <h5 class="card-title">{title}</h5>
            <p class="fw-light">
                {explanationText} 
            </p>
        </div>
        <svg {width} {height}>
            <g transform={`translate(${padding.left}, ${padding.top})`}>
                <!-- X-axis -->
                <DateXAxis {xScale} {innerWidth} {innerHeight} {tickSize}/>

                <!-- Y-axis -->
                <ValueYAxis {yScale} {innerHeight} {innerWidth} {tickSize} left={true} axisTitle={leftAxisTitle} />

                <!-- Data line -->
                {#each lineData as data, i}
                    <path d="{lineFunc(data)}" fill="none" stroke="{colorScale(i)}" stroke-width="2" />
                {/each}

                <!-- Markers for dates with meter readings -->
                {#each readingsDates as data, i}
                    {#each data as point, j}
                        <line x1="{xScale(point)}" y1="0" x2="{xScale(point)}" y2="{innerHeight}" stroke="{colorScale(i)}"/>
                    {/each}
                {/each}

                <!--Optional: Observations-->
                {#if showObservations}
                    <ValueYAxis yScale={yScaleRight} {innerHeight} {innerWidth} {tickSize} left={false} axisTitle={rightAxisTitle} />

                    {#each obsLineDate as data, i}
                        <path d="{obsLineFunc(data)}" fill="none" stroke="{colorScale(consumers.length - 1)}" stroke-width="2"/>
                    {/each}
                {/if}

                <!--Optional: Benchmark-->
                {#if benchmarkLineData}
                    {#each benchmarkLineData as data, i}
                        <path d="{lineFunc(data)}" fill="none" stroke="red" stroke-width="2"/>
                    {/each}
                {/if}
            </g>

            <!-- Legend -->
            {#if legend}
                <g transform={`translate(${width - padding.right - width * 0.25}, ${padding.top * 1.1})`}>
                    <Legend width={width * 0.2} height={(consumers.length + (benchmarkLineData ? 1 : 0)) * height * 0.05} 
                        entries={consumers.map(e => e.name)} {colorScale} showBenchmark={benchmarkLineData ? true : false} />
                </g>
            {/if}
        </svg>
    </div>
{/if}