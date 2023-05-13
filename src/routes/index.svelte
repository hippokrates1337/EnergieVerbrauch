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
                cookieConsent: session.user?.cookie_consent_level, 
                readings: readings.data
            }
        };
    }
</script>

<script lang="ts">
    import { generateDailyData } from "$lib/api";
    import ConsumptionLineChart from "$lib/components/ConsumptionLineChart.svelte";

    export let cookieConsent: CookieConsent;
    export let readings: Reading[];
    export let width: number;
    let explanationText: string = "Dieser Graph zeigt den täglichen Ressourcenverbrauch aller Nutzer dieser Webseite an. Die Linie 'alle Nutzer' zeigt die täglichen Verbrauchswerte und bezieht sich auf die linke Achse. Die Linie 'Beobachtungen' zeigt, auf wie vielen Werten (also von Nutzern eingegebenen Verbräuchen) der Durchschnitt basiert und bezieht sich auf die rechte Achse.";

    $: chartData = generateDailyData(readings, "population");
</script>

{#if cookieConsent == undefined || cookieConsent["strictly-necessary"] == false}
    <p class="fw-light bg-light p-3">
        Um diese Seite zu nutzen, müssen Sie mindestens der Verwendung funktional notwendiger Cookies zustimmen.
    </p>
{:else}
    {#if chartData.data == undefined || chartData.data.length < 1 || chartData.data[0].observations.length < 2}
        <p class="fw-light bg-light p-3">
            In unserer Datenbank liegen leider noch keine Daten vor, die hier angezeigt werden könnten.
        </p>
    {:else}
        
        <div bind:clientWidth={width}>
            <div class="">
                <ConsumptionLineChart {chartData} type="electricity"
                consumers={[{
                    uid: "",
                    name: "Alle Nutzer",
                    user: "",
                    area: 0,
                    adults: 0,
                    children: 0,
                    type: "",
                    coldWaterOnly: false,
                    createdAt: new Date(),
                    updatedAt: new Date()}, 
                    {uid: "",
                    name: "Beobachtungen",
                    user: "",
                    area: 0,
                    adults: 0,
                    children: 0,
                    type: "",
                    coldWaterOnly: false,
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
                    area: 0,
                    adults: 0,
                    children: 0,
                    type: "",
                    coldWaterOnly: false,
                    createdAt: new Date(),
                    updatedAt: new Date()}, 
                    {uid: "",
                    name: "Beobachtungen",
                    user: "",
                    area: 0,
                    adults: 0,
                    children: 0,
                    type: "",
                    coldWaterOnly: false,
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
                    area: 0,
                    adults: 0,
                    children: 0,
                    type: "",
                    coldWaterOnly: false,
                    createdAt: new Date(),
                    updatedAt: new Date()}, 
                    {uid: "",
                    name: "Beobachtungen",
                    user: "",
                    area: 0,
                    adults: 0,
                    children: 0,
                    type: "",
                    coldWaterOnly: false,
                    createdAt: new Date(),
                    updatedAt: new Date()}]}
                title="Warmwasser" {explanationText}
                parentWidth={width} showObservations={true} legend={true} 
                leftAxisTitle="m3 / Tag" rightAxisTitle="#" />
            </div>
        </div>
    {/if}
    
{/if}