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
</script>

<ul>
    {#each observations as obs}
    <li>{new Date(obs.date).toLocaleDateString()}: {obs.value} {obs.unit}</li>
    {/each}
</ul>
