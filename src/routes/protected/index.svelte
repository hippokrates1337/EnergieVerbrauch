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
</script>

<ConsumptionLineChart {obsUnits} {observations} />