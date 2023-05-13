<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        if(session.user?.uid == "" || session.user?.cookie_consent_level["strictly-necessary"] == undefined || session.user?.cookie_consent_level["strictly-necessary"] == false) {
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
    let explanationText: string = "Dieser Graph zeigt Deinen täglichen Ressourcenverbrauch je 'Verbraucher' im Vergleich zu allen anderen Nutzern der Webseite, für die genügend Zählerstände hinterlegt wurden (rote Linie 'Benchmark'). Die vertikalen farbigen Linien zeigen die Tage an, für die Du Zählerstände hinterlegt hast. Aktuell kann die Vergleichsgruppe noch nicht individuell festgelegt werden, dies ist für die Zukunft geplant.";

    $: chartData = generateDailyData(readings, "consumer");
    $: benchmarkData = generateDailyData(populationReadings, "population");
</script>
{#if chartData.data == undefined || chartData.data.length < 2}
    <p class="fw-light bg-light p-3">
        Du hast noch keine Daten eingegeben, die hier angezeigt werden könnten. Lege zunächst (mindestens einen) Verbraucher
        an und hinterlege dann (mindestens zwei) Zählerstände. Anschließend wird Dir hier eine Auswertung Deines Verbrauchs angezeigt.
    </p>
{:else}
    <div bind:clientWidth={width}>
        <div class="">
            <ConsumptionLineChart {chartData} {consumers} {benchmarkData}
            type="electricity" title="Strom" {explanationText} parentWidth={width} 
            leftAxisTitle="kWh / Tag" />
        </div>
        <div class="mt-5">
            <ConsumptionLineChart {chartData} {consumers} {benchmarkData}
            type="coldWater" title="Kaltwasser" {explanationText} parentWidth={width} 
            leftAxisTitle="m3 / Tag" />
        </div>
        <div class="mt-5">
            <ConsumptionLineChart {chartData} {consumers} {benchmarkData}
            type="warmWater" title="Warmwasser" {explanationText} parentWidth={width} 
            leftAxisTitle="m3 / Tag" />
        </div>
    </div>
{/if}