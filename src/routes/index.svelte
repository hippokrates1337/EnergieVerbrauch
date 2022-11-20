<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        // Load all observations (to be passed into props)
        const res = await fetch("/protected/readings");
        let readings;
        if(res.ok) {
            readings = await res.json();
        }

        return {
            status: 200,
            props: {
                readings: readings.data
            }
        };
    }

</script>

<script lang="ts">
    import { generateDailyData } from "$lib/api";
    import ConsumptionLineChart from "$lib/components/ConsumptionLineChart.svelte";

    export let readings: Reading[];
    export let width: number;

    $: chartData = generateDailyData(readings, "population");

    $: console.log(chartData);
</script>

<div bind:clientWidth={width}>
    <div class="mt-5">
        <ConsumptionLineChart {chartData} type="electricity" title="Gesamtverbrauch an Strom (kWh) / Anzahl Beobachtungen" parentWidth={width} showObservations={true} />
    </div>
    <div class="mt-5">
        <ConsumptionLineChart {chartData} type="coldWater" title="Gesamtverbrauch an Kaltwasser (m3) / Anzahl Beobachtungen" parentWidth={width} showObservations={true} />
    </div>
    <div class="mt-5">
        <ConsumptionLineChart {chartData} type="warmWater" title="Gesamtverbrauch an Warmassser (m3) / Anzahl Beobachtungen" parentWidth={width} showObservations={true} />
    </div>
</div>