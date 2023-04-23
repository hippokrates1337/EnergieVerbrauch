<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let consumers: Consumer[];
    export let readings: Reading[];

    const toggleEdit = (uid: string) => {
        dispatch("editConsumer", {uid: uid});
    }

    const deleteConsumer = (uid: string) => {
        dispatch("deleteConsumer", {uid: uid});
    }
</script>

{#if consumers.length > 0}
    <div class="row p-3 mb-3">
        <div class="col-4">
            <div class="list-group list-group-light" id="listTab" role="tablist">
                {#each consumers as consumer, i}
                    <a class="list-group-item list-group-item-action border-0 {i == 0 ? 'active' : ''}" 
                    id="list{i}Link" data-bs-toggle="list" href="#list{i}" role="tab" aria-controls="list{i}">
                    {consumer.name}
                    <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => toggleEdit(consumer.uid)}>
                        <i class="fa fa-pencil" style="color:yellow"/>
                    </button>
                    <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => deleteConsumer(consumer.uid)}>
                        <i class="fa fa-trash" style="color:red" />
                    </button>
                    </a>
                {/each}
            </div>
        </div>
        <div class="col-8">
            <div class="tab-content" id="navTabContent">
                {#each consumers as consumer, i}
                    <div class="tab-pane fade {i == 0 ? 'active show' : ''} border-0" id="list{i}" role="tabpanel" aria-labelledby="list{i}">
                        <b>Name:</b> {consumer.name}
                        <br>
                        <b>Hinzugefügt am:</b> {new Date(consumer.createdAt).toDateString()}<br>
                        <b>Hinterlegte Verbrauchswerte:</b> {readings.filter(e => e.consumer == consumer.uid).length} <br>
                        <b>Wohnfläche:</b> {consumer.area} <br>
                        <b>Art: </b> {
                            consumer.type == "house" ? "Freistehendes Haus" :
                            consumer.type == "townhouse" ? "Reihenhaus" : 
                            consumer.type == "semidetached" ? "Doppelhaushälfte" :
                            consumer.type == "appartment" ? "Wohnung" :
                            consumer.type == "holidayhome" ? "Ferienhaus" : 
                            consumer.type == "holidayflat" ? "Ferienwohnung" :
                            consumer.type == "other" ? "Andere" : ""
                        }<br>
                        <b>Anzahl Erwachsener:</b> {consumer.adults} <br>
                        <b>Anzahl Kinder:</b> {consumer.children} <br>
                    </div>
                {/each}
            </div>  
        </div>
    </div>
{/if}

