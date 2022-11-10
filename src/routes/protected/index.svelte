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
        let res = await fetch("/protected/consumers");
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

        return {
            status: 200,
            props: {
                consumers: consumers.data,
                readings: readings.data
            }
        };
    }
</script>

<!--
<script lang="ts">
    import ConsumptionLineChart from "$lib/components/ConsumptionLineChart.svelte";

    export let consumers: Consumer[];
    export let readings: Reading[];
    let width: number;

    $: coldWater = readings.filter((reading) => (reading.type == "coldWater"));
    $: warmWater = readings.filter((reading) => (reading.type == "warmWater"));
    $: electricity = readings.filter((reading) => (reading.type == "electricity"));
    $: startDate = readings.map(reading => reading.date).sort((a, b) => (new Date(a) as any) - (new Date(b) as any))[0];
    $: endDate = readings.map(reading => reading.date).sort((a, b) => (new Date(b) as any) - (new Date(a) as any))[0];
</script>

<div bind:clientWidth={width}>
    <div class="mb-5">
        <ConsumptionLineChart {consumers} readings={coldWater} title="Kaltwasser" parentWidth={width} {startDate} {endDate} />
    </div>
    <div class="mb-5">
        <ConsumptionLineChart {consumers} readings={warmWater} title="Warmwasser" parentWidth={width} {startDate} {endDate} />
    </div>
    <ConsumptionLineChart {consumers} readings={electricity} title="Strom" parentWidth={width} {startDate} {endDate} />
</div>
-->