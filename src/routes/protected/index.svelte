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
        let res = await fetch("/protected/obsunits");
        let units;
        if(res.ok) {
            units = await res.json();
        }

        // Load user's observations (to be passed into props)
        res = await fetch("/protected/observations");
        let obs;
        if(res.ok) {
            obs = await res.json();
        }

        return {
            status: 200,
            props: {
                obsUnits: units.data,
                observations: obs.data
            }
        };
    }
</script>

<script lang="ts">
    import ConsumptionLineChart from "$lib/components/ConsumptionLineChart.svelte";

    export let obsUnits: ObservationUnit[];
    export let observations: Observation[];
    let width: number;

    $: coldWater = observations.filter((obs) => (obs.type == "coldWater"));
    $: warmWater = observations.filter((obs) => (obs.type == "warmWater"));
    $: electricity = observations.filter((obs) => (obs.type == "electricity"));
    $: startDate = observations.map(obs => obs.startDate).sort((a, b) => (new Date(a) as any) - (new Date(b) as any))[0];
    $: endDate = observations.map(obs => obs.endDate).sort((a, b) => (new Date(b) as any) - (new Date(a) as any))[0];
</script>

<div bind:clientWidth={width}>
    <div class="mb-5">
        <ConsumptionLineChart {obsUnits} observations={coldWater} title="Kaltwasser" parentWidth={width} {startDate} {endDate} />
    </div>
    <div class="mb-5">
        <ConsumptionLineChart {obsUnits} observations={warmWater} title="Warmwasser" parentWidth={width} {startDate} {endDate} />
    </div>
    <ConsumptionLineChart {obsUnits} observations={electricity} title="Strom" parentWidth={width} {startDate} {endDate} />
</div>
