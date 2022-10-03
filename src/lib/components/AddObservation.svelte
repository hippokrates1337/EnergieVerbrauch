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
    
    let obsType: string = "electricity";

    const addObservation = async(event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        dispatch("add", formElement);
    }
</script>

<form on:submit|preventDefault={addObservation} action="/protected/observations" method="post" autocomplete="off">
    <div class="d-flex flex-row align-items-center mb-4">
        <i class="fa fa-home fa-lg ms-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <select class="form-select" name="obsunit" id="obsunit" aria-label="Auswahl des Verbrauchers" required>
                {#each obsUnits as unit}
                    <option>{unit.name}</option>
                {/each}
            </select>
        </div>
        <i class="fa fa-bolt ms-3 fa-fw"></i><i class="fa fa-tint me-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <select bind:value={obsType} class="form-select" name="obstype" id="obstype" aria-label="Art des Verbrauchs" required>
                <option value="electricity">Strom</option>
                <option value="coldWater">Kaltwasser</option>
                <option value="warmWater">Warmwasser</option>
            </select>
        </div>
    </div>
    <div class="d-flex flex-row align-items-center mb-4">
        <i class="fa fa-play fa-lg ms-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input class="form-control" type="date" id="startdate" name="startdate" aria-label="Beginn des Verbrauchs" required/>
        </div>
        <i class="fa fa-stop fa-lg ms-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input class="form-control" type="date" id="enddate" name="enddate" aria-label="Ende des Verbrauchs" required/>
        </div> 
        <i class="fa fa-calculator fa-lg ms-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input class="form-control" type="text" id="obsvalue" name="obsvalue" aria-label="Verbrauchswert" required />
        </div>
        {obsType == "electricity" ? "kWh" : "m3"}
    </div>
    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
        <button class="btn btn-primary" type="submit" aria-label="Neuen Verbrauchswert hinzufügen">Hinzufügen</button>
    </div>
</form>

{#if addObservationError}
    <p class="text-danger">{addObservationError}</p>
{/if}