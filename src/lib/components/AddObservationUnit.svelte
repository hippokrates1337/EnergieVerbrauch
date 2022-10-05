<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let addUnitError: string = ""

    const addUnit = async (event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        dispatch("add", formElement);
    }
</script>

<div class="row">
    <form on:submit|preventDefault={addUnit} action="/protected/obsunits" method="post" autocomplete="off">
            <div class="d-flex flex-row align-items-center mb-4">
                <i class="fa fa-home fa-lg me-3 fa-fw"></i>
                <div class="form-outline flex-fill mb-0">
                    <input class="form-control" type="text" id="unitName" name="unitName" required aria-label="Name des Verbrauchers"/>
                </div>
                <button class="btn btn-primary" type="submit" aria-label="Neuen Verbraucher hinzufügen">Hinzufügen</button>
            </div>
    </form>
</div>
{#if addUnitError}
    <p class="text-danger">{addUnitError}</p>
{/if}
