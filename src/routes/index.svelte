<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";
    import bootstrapCookieConsentSettings  from "bootstrap-cookie-consent-settings";

    export const load: Load = async ({ fetch }) => {
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
    let explanationText: string = "Dieser Graph zeigt den täglichen Ressourcenverbrauch aller Nutzer dieser Webseite an. Die Linie 'alle Nutzer' zeigt die täglichen Verbrauchswerte und bezieht sich auf die linke Achse. Die Linie 'Beobachtungen' zeigt, auf wie vielen Werten (also von Nutzern eingegebenen Verbräuchen) der Durchschnitt basiert und bezieht sich auf die rechte Achse.";

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
        title="Strom" {explanationText}
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
        title="Kaltwasser" {explanationText}
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
        title="Warmwasser" {explanationText}
        parentWidth={width} showObservations={true} legend={true} 
        leftAxisTitle="m3 / Tag" rightAxisTitle="#" />
    </div>
</div>