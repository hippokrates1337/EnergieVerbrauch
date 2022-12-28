<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let addConsumerError: string = ""
    export let editMode: boolean;
    export let currentValues: Consumer;

    const addOrUpdateConsumer = async (event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        dispatch("addOrUpdate", formElement);
    }
</script>

<div class="row">
    <form on:submit|preventDefault={addOrUpdateConsumer} action="/protected/consumers" method="post" autocomplete="off">
        <div class="d-flex flex-row align-items-center mb-4">
            <i class="fa fa-home fa-lg me-3 fa-fw"></i>
            <div class="form-outline flex-fill mb-0">
                <input class="form-control" type="text" placeholder="Name des Verbrauchers"
                value={editMode ? currentValues.name : ""}
                id="consumerName" name="consumerName" required aria-label="Name des Verbrauchers"/>
            </div>
            <i class="fa fa-square-o fa-lg me-3 fa-fw"></i>
            <div class="form-outline flex-fill mb-0">
                <input class="form-control" type="number" placeholder ="Fläche (m2)"
                value={editMode ? currentValues.area : ""}
                id="consumerArea" name="consumerArea" required aria-label="Fläche des Verbrauchers"/>
            </div>
        </div>
        <div class="d-flex flex-row align-items-center mb-4">
            <i class="fa fa-male fa-lg me-3 fa-fw"></i>
            <div class="form-outline flex-fill mb-0">
                <input class="form-control" type="number" placeholder="Erwachsene"
                value={editMode ? currentValues.adults : ""}
                id="consumerAdults" name="consumerAdults" required aria-label="Anzahl Erwachsene"/>
            </div>
            <i class="fa fa-child fa-lg me-3 fa-fw"></i>
            <div class="form-outline flex-fill mb-0">
                <input class="form-control" type="number" placeholder="Kinder"
                value={editMode ? currentValues.children : ""}
                id="consumerChildren" name="consumerChildren" required aria-label="Anzahl Kinder"/>
            </div>
        </div>
        <div class="row ps-4 pe-4">
            <button class="btn btn-primary btn-block" type="submit" aria-label="Neuen Verbraucher hinzufügen">
                {editMode ? "Aktualisieren" : "Hinzufügen"}
            </button>
        </div>
    </form>
</div>
{#if addConsumerError}
    <p class="text-danger">{addConsumerError}</p>
{/if}
