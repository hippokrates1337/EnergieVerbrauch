<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        if(!session.user) {
            return {
                status: 302,
                redirect: "/auth/login"
            };
        }

        return {
            status: 200
        };
    }
</script>

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    
    import EnterObservation from "$lib/components/EnterObservation.svelte"; 

    export let obsUnits: ObservationUnit[];
    export let addObservationError: string = "";

    const addObservation = async(event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        dispatch("add", formElement);
    }
</script>

<form on:submit|preventDefault={addObservation} action="/protected/observations" method="post" autocomplete="off">
    <EnterObservation {obsUnits} />
</form>

{#if addObservationError}
    <p class="text-danger">{addObservationError}</p>
{/if}