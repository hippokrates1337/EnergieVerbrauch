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
                user: session.user.userName,
                obsUnits: units.data,
                observations: obs.data
            }
        };
    }
</script>

<script lang="ts">
    import { send } from "$lib/api";

    export let user: string;
    export let obsUnits: ObservationUnit[];
    export let observations: Observation[];
    let addUnitError: string = ""
    let obsUnitOfMeasure: string = "electricity";
    let addObservationError: string = "";

    const addUnit = async (event: SubmitEvent) => {
        addUnitError = ""

        const formElement = event.target as HTMLFormElement;
        const response = await send(formElement);
        
        if(response.error) {
            addUnitError = response.error;
        }

        if(response.success) {
            const newUnit = response.data;
            obsUnits = [...obsUnits, newUnit];
            formElement.reset();
        }
    }

    const addObservation = async(event: SubmitEvent) => {
        addObservationError = "";

        const formElement = event.target as HTMLFormElement;
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

<h1>Innerer Bereich - {user}</h1>

<h2>Hinterlegte Verbraucher</h2>
<ul>
    {#each obsUnits as unit}
        <li>{unit.name}</li>
    {/each}
</ul>

<form on:submit|preventDefault={addUnit} action="/protected/obsunits" method="post" autocomplete="off">
    <label for="unitName">Name: </label>
    <input type="text" id="unitName" name="unitName" required aria-label="Name des Verbrauchers"/>
    <button type="submit" aria-label="Neuen Verbraucher hinzufügen">Hinzufügen</button>
</form>

{#if addUnitError}
    <p>{addUnitError}</p>
{/if}

<h2>Hinterlegte Verbrauchswerte</h2>

<ul>
    {#each observations as obs}
    <li>{new Date(obs.date).toLocaleDateString()}: {obs.value} {obs.unit}</li>
    {/each}
</ul>

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