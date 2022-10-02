<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        if(!session.user) {
            return {
                status: 302,
                redirect: "/auth/login"
            };
        }

        // Load user's observations (to be passed into props)
        const res = await fetch("/protected/observations");
        let obs;
        if(res.ok) {
            obs = await res.json();
        }

        return {
            status: 200,
            props: {
                observations: obs.data
            }
        };
    }
</script>

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import dayjs from "dayjs";

    export let observations: Observation[];
    export let obsUnits: ObservationUnit[];
    let electricity: Observation[] = [], coldWater: Observation[] = [], warmWater: Observation[] = [];
    let showEdit: boolean = false;
    let newObsUnit: string, newType: string, newStartDate: string, newEndDate: string, newValue: number;
    
    $: electricity = observations.filter(a => a.type == "electricity");
    $: coldWater = observations.filter(a => a.type == "coldWater");
    $: warmWater = observations.filter(a => a.type == "warmWater");


    const deleteObs = (uid: string) => {
        dispatch("delete", uid);
    }

    const toggleEdit = (obs: Observation) => {
        showEdit = !showEdit;
        newType = obs.type;
        newStartDate = dayjs(obs.startDate).format("YYYY-MM-DD");
        newEndDate = dayjs(obs.endDate).format("YYYY-MM-DD");
        newValue = obs.value;
    }

    const changeObservation = async (uid: string) => {
        dispatch("change", {
            uid: uid,
            newObsUnit: newObsUnit,
            newType: newType,
            newStartDate: newStartDate,
            newEndDate: newEndDate,
            newValue: newValue
        });
    }
</script>

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Kaltwasser</p>
<ul>
    {#each coldWater as obs}
    <li>
        {new Date(obs.startDate).toLocaleDateString()} - {new Date(obs.endDate).toLocaleDateString()}: {obs.value} {obs.unit}
        <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => deleteObs(obs.uid)}><i class="fa fa-trash"></i></button>
        <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => toggleEdit(obs)}><i class="fa fa-pencil"></i></button>
        {#if showEdit}
            <div class="d-flex flex-row align-items-center mb-4">
                <i class="fa fa-home fa-lg ms-3 fa-fw"></i>
                <div class="form-outline flex-fill mb-0">
                    <select class="form-select" bind:value={newObsUnit} name="obsunit" id="obsunit" aria-label="Auswahl des Verbrauchers" required>
                        {#each obsUnits as unit}
                            <option>{unit.name}</option>
                        {/each}
                    </select>
                </div>
                <i class="fa fa-bolt ms-3 fa-fw"></i><i class="fa fa-tint me-3 fa-fw"></i>
                <div class="form-outline flex-fill mb-0">
                    <select bind:value={newType} class="form-select" name="obstype" id="obstype" aria-label="Art des Verbrauchs" required>
                        <option value="electricity">Strom</option>
                        <option value="coldWater">Kaltwasser</option>
                        <option value="warmWater">Warmwasser</option>
                    </select>
                </div>
            </div>
            <div class="d-flex flex-row align-items-center mb-4">
                <i class="fa fa-play fa-lg ms-3 fa-fw"></i>
                <div class="form-outline flex-fill mb-0">
                    <input class="form-control" type="date" bind:value={newStartDate} id="startdate" name="startdate" aria-label="Beginn des Verbrauchs" required/>
                </div>
                <i class="fa fa-stop fa-lg ms-3 fa-fw"></i>
                <div class="form-outline flex-fill mb-0">
                    <input class="form-control" type="date" bind:value={newEndDate} id="enddate" name="enddate" aria-label="Ende des Verbrauchs" required/>
                </div> 
                <i class="fa fa-calculator fa-lg ms-3 fa-fw"></i>
                <div class="form-outline flex-fill mb-0">
                    <input class="form-control" type="text" bind:value={newValue} id="obsvalue" name="obsvalue" aria-label="Verbrauchswert" required />
                </div>
                {newType == "electricity" ? "kWh" : "m3"}
                <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => changeObservation(obs.uid)}><i class="fa fa-floppy-o"></i></button>
            </div>
        {/if}
    </li>
    {/each}
</ul>

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Warmwasser</p>
<ul>
    {#each warmWater as obs}
    <li>
        {new Date(obs.startDate).toLocaleDateString()} - {new Date(obs.endDate).toLocaleDateString()}: {obs.value} {obs.unit}
        <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => deleteObs(obs.uid)}><i class="fa fa-trash"></i></button>
    </li>
    {/each}
</ul>

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Strom</p>
<ul>
    {#each electricity as obs}
    <li>
        {new Date(obs.startDate).toLocaleDateString()} - {new Date(obs.endDate).toLocaleDateString()}: {obs.value} {obs.unit}
        <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => deleteObs(obs.uid)}><i class="fa fa-trash"></i></button>
    </li>
    {/each}
</ul>