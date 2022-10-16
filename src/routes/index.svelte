<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        // Load all observations (to be passed into props)
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
    export let observations: SummaryObservation[];
</script>

<div class="container">
    <ul class="list-group">
        {#each observations as obs}
            <li class="list-item">
                {JSON.stringify(obs)}
            </li>
        {/each}
    </ul>
</div>