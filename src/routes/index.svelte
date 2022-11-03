<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        // Load all observations (to be passed into props)
        const res = await fetch("/protected/observations");
        let obs;
        if(res.ok) {
            obs = await res.json();
        }

        return {
            status: 200,
            props: {
                observations: obs.data
            }
        };
    }

</script>

<script lang="ts">
    import SummaryLineChart from "$lib/components/SummaryLineChart.svelte";
    
    export let observations: SummaryObservation[];
    let summaryData: Map<string, Map<string, object>>;
    let startDate: Date, endDate: Date;
    let coldWater: boolean, warmWater: boolean, electricity: boolean;
    let width: number;

    const summarizeData = (observations: SummaryObservation[]) => {        
        let data = new Map();
        coldWater = warmWater = electricity = false;

        if(observations.length == 0) {
            return data;
        }

        startDate = observations[0].startDate;
        endDate = new Date(0);

        for(const obs of observations) {
            let start = new Date(obs.startDate);
            let end = new Date(obs.endDate);
            let avgConsumption = obs.value / ((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));

            if(obs.type == "coldWater") coldWater = true;
            if(obs.type == "warmWater") warmWater = true;
            if(obs.type == "electricity") electricity = true;

            // Store minimum and maximum data to standardize X-axis across charts
            if(startDate > start) startDate = start;
            if(endDate < end) endDate = end;
            
            
            while(start <= end) {
                if(data.has(start.toString())) {
                    if(data.get(start.toString()).has(obs.type)) {
                        data.get(start.toString()).get(obs.type)["obsCount"]++;
                        data.get(start.toString()).get(obs.type)["totalValue"] += avgConsumption;
                    } else {
                        data.get(start.toString()).set(obs.type, {
                            obsCount: 1,
                            totalValue: avgConsumption
                        });
                    }
                } else {
                    data.set(start.toString(), new Map());
                    data.get(start.toString()).set(obs.type, {
                        obsCount: 1,
                        totalValue: avgConsumption
                    });
                }

                start.setDate(start.getDate() + 1);
            }
        }

        return data;
    }

    $: summaryData = summarizeData(observations);
</script>

{#if coldWater}
    <div class="container mt-5 mb-5" bind:clientWidth={width}>
        <SummaryLineChart {summaryData} obsType="coldWater" title={"Kaltwasser"} parentWidth={width} {startDate} {endDate}/>
    </div>
{/if}

{#if warmWater}
    <div class="container mb-5" bind:clientWidth={width}>
        <SummaryLineChart {summaryData} obsType="warmWater" title={"Warmwasser"} parentWidth={width} {startDate} {endDate}/>
    </div>
{/if}

{#if electricity}
    <div class="container mb-5" bind:clientWidth={width}>
        <SummaryLineChart {summaryData} obsType="electricity" title={"Strom"} parentWidth={width} {startDate} {endDate}/>
    </div>
{/if}