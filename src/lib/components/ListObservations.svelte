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

    export let observations: Observation[];
    let electricity: Observation[] = [], coldWater: Observation[] = [], warmWater: Observation[] = [];
    
    $: electricity = observations.filter(a => a.type == "electricity");
    $: coldWater = observations.filter(a => a.type == "coldWater");
    $: warmWater = observations.filter(a => a.type == "warmWater");

    const deleteObs = (uid: String) => {
        dispatch("delete", uid);
    }
</script>

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Kaltwasser</p>
<ul>
    {#each coldWater as obs}
    <li>
        {new Date(obs.startDate).toLocaleDateString()} - {new Date(obs.endDate).toLocaleDateString()}: {obs.value} {obs.unit}
        <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => deleteObs(obs.uid)}><i class="fa fa-trash"></i></button>
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