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
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let obsUnits: ObservationUnit[];
    export let addObservationError: string = "";
    
    let obsUnitOfMeasure: string = "electricity";

    const addObservation = async(event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        dispatch("add", formElement);
    }
</script>

<form on:submit|preventDefault={addObservation} action="/protected/observations" method="post" autocomplete="off">
    <label for="obsunit">Verbraucher: </label>
    <select name="obsunit" id="obsunit" aria-label="Auswahl des Verbrauchers">
        {#each obsUnits as unit}
            <option>{unit.name}</option>
        {/each}
    </select>
    <label for="obsdate">Datum: </label>
    <input type="date" id="obsdate" name="obsdate" aria-label="Datum des Verbrauchswerts"/>
    <label for="obstype">Verbrauchsart: </label>
    <select bind:value={obsUnitOfMeasure} name="obstype" id="obstype" aria-label="Art des Verbrauchs">
        <option value="electricity">Strom</option>
        <option value="water">Wasser</option>
    </select>
    <label for="obsvalue">Verbrauchswert: </label>
    <input type="text" id="obsvalue" name="obsvalue" aria-label="Verbrauchswert" />
    {obsUnitOfMeasure == "electricity" ? "kWh" : "m3"}
    <button type="submit" aria-label="Neuen Verbrauchswert hinzufügen">Hinzufügen</button>
</form>

{#if addObservationError}
    <p>{addObservationError}</p>
{/if}