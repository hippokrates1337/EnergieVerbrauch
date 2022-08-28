<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let addUnitError: string = ""

    const addUnit = async (event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        dispatch("add", formElement);
    }
</script>

<form on:submit|preventDefault={addUnit} action="/protected/obsunits" method="post" autocomplete="off">
    <label for="unitName">Name: </label>
    <input type="text" id="unitName" name="unitName" required aria-label="Name des Verbrauchers"/>
    <button type="submit" aria-label="Neuen Verbraucher hinzufügen">Hinzufügen</button>
</form>

{#if addUnitError}
    <p>{addUnitError}</p>
{/if}