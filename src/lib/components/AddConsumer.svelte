<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let addConsumerError: string = ""

    const addConsumer = async (event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        dispatch("add", formElement);
    }
</script>

<div class="row">
    <form on:submit|preventDefault={addConsumer} action="/protected/consumers" method="post" autocomplete="off">
            <div class="d-flex flex-row align-items-center mb-4">
                <i class="fa fa-home fa-lg me-3 fa-fw"></i>
                <div class="form-outline flex-fill mb-0">
                    <input class="form-control" type="text" id="consumerName" name="consumerName" required aria-label="Name des Verbrauchers"/>
                </div>
                <button class="btn btn-primary" type="submit" aria-label="Neuen Verbraucher hinzufügen">Hinzufügen</button>
            </div>
    </form>
</div>
{#if addConsumerError}
    <p class="text-danger">{addConsumerError}</p>
{/if}
