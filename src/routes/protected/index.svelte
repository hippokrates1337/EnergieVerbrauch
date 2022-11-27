<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        if(!session.user) {
            return {
                status: 302,
                redirect: "/auth/login"
            };
        }

        // Load user's observation units (to be passed into props)
        let res = await fetch("/protected/consumers/" + session.user.uid);
        let consumers;
        if(res.ok) {
            consumers = await res.json();
        }

        // Load user's observations (to be passed into props)
        res = await fetch("/protected/readings/" + session.user.uid);
        let readings;
        if(res.ok) {
            readings = await res.json();
        }

        // Load all observations for benchmarking
        res = await fetch("/protected/readings");
        let populationReadings;
        if(res.ok) {
            populationReadings = await res.json();
        }

        return {
            status: 200,
            props: {
                consumers: consumers.data,
                readings: readings.data,
                populationReadings: populationReadings.data
            }
        };
    }
</script>

<script lang="ts">
    import { generateDailyData } from "$lib/api";
    import ConsumptionLineChart from "$lib/components/ConsumptionLineChart.svelte";

    export let consumers: Consumer[];
    export let readings: Reading[];
    export let populationReadings: Reading[];
    let width: number;

    $: chartData = generateDailyData(readings, "consumer");
    $: benchmarkData = generateDailyData(populationReadings, "population");
</script>

<div bind:clientWidth={width}>
    <div class="">
        <ConsumptionLineChart {chartData} {consumers} {benchmarkData}
        type="electricity" title="Täglicher Verbrauch an Strom (kWh)" parentWidth={width} />
    </div>
    <div class="mt-5">
        <ConsumptionLineChart {chartData} {consumers} 
        type="coldWater" title="Täglicher Verbrauch an Kaltwasser (m3)" parentWidth={width} />
    </div>
    <div class="mt-5">
        <ConsumptionLineChart {chartData} {consumers} 
        type="warmWater" title="Täglicher Verbrauch an Warmwasser (m3)" parentWidth={width} />
    </div>
</div>
