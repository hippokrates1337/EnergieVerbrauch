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
    import { send } from "$lib/api";
    import ListObservations from "$lib/components/ListObservations.svelte";
    import AddObservation from "$lib/components/AddObservation.svelte";

    export let obsUnits: ObservationUnit[];
    export let observations: Observation[];
    
    let addObservationError: string = "";

    const addObservation = async (formElement: HTMLFormElement) => {
        addObservationError = "";

        const response = await send(formElement);

        if(response.error) {
            addObservationError = response.error;
        }

        if(response.success) {
            const newObs = response.data;
            observations = [...observations, newObs];
            formElement.reset();
        }
    }
</script>

<h2>Verbrauchswerte verwalten</h2>

<AddObservation {obsUnits} {addObservationError} on:add={e => addObservation(e.detail)}/>

<ListObservations {observations}/>