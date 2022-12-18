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
</script>

<div bind:clientWidth={width}>
    <div class="">
        <ConsumptionLineChart {chartData} type="electricity"
        consumers={[{
            uid: "",
            name: "Alle Nutzer",
            user: "",
            createdAt: new Date(),
            updatedAt: new Date()}, 
            {uid: "",
            name: "Beobachtungen",
            user: "",
            createdAt: new Date(),
            updatedAt: new Date()}]}
        title="Strom" 
        parentWidth={width} showObservations={true} legend={true} 
        leftAxisTitle="kWh / Tag" rightAxisTitle="#" />
    </div>
    <div class="mt-5">
        <ConsumptionLineChart {chartData} type="coldWater"
        consumers={[{
            uid: "",
            name: "Alle Nutzer",
            user: "",
            createdAt: new Date(),
            updatedAt: new Date()}, 
            {uid: "",
            name: "Beobachtungen",
            user: "",
            createdAt: new Date(),
            updatedAt: new Date()}]}
        title="Kaltwasser" 
        parentWidth={width} showObservations={true} legend={true} 
        leftAxisTitle="m3 / Tag" rightAxisTitle="#" />
    </div>
    <div class="mt-5">
        <ConsumptionLineChart {chartData} type="warmWater"
        consumers={[{
            uid: "",
            name: "Alle Nutzer",
            user: "",
            createdAt: new Date(),
            updatedAt: new Date()}, 
            {uid: "",
            name: "Beobachtungen",
            user: "",
            createdAt: new Date(),
            updatedAt: new Date()}]}
        title="Warmwasser" 
        parentWidth={width} showObservations={true} legend={true} 
        leftAxisTitle="m3 / Tag" rightAxisTitle="#" />
    </div>
</div>