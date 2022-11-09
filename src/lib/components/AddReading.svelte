<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    
    import EnterReading from "$lib/components/EnterReading.svelte"; 

    export let consumers: Consumer[];
    export let addReadingError: string = "";

    const addReading = async(event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        dispatch("add", formElement);
    }
</script>

<form on:submit|preventDefault={addReading} action="/protected/readings" method="post" autocomplete="off">
    <EnterReading {consumers} />
</form>

{#if addReadingError}
    <p class="text-danger">{addReadingError}</p>
{/if}