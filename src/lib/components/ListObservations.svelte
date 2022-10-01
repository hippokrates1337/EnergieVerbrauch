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
    export let observations: Observation[];
    let electricity: Observation[] = [], coldWater: Observation[] = [], warmWater: Observation[] = [];
    
    $: electricity = observations.filter(a => a.type == "electricity");
    $: coldWater = observations.filter(a => a.type == "coldWater");
    $: warmWater = observations.filter(a => a.type == "warmWater");
</script>

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Kaltwasser</p>
<ul>
    {#each coldWater as obs}
    <li>{new Date(obs.date).toLocaleDateString()}: {obs.value} {obs.unit}</li>
    {/each}
</ul>

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Warmwasser</p>
<ul>
    {#each warmWater as obs}
    <li>{new Date(obs.date).toLocaleDateString()}: {obs.value} {obs.unit}</li>
    {/each}
</ul>

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Strom</p>
<ul>
    {#each electricity as obs}
    <li>{new Date(obs.date).toLocaleDateString()}: {obs.value} {obs.unit}</li>
    {/each}
</ul>