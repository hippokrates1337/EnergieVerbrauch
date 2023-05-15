<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let consumers: Consumer[];
    export let readings: Reading[];
    let focusConsumer: string;

    const toggleEdit = (uid: string) => {
        dispatch("editConsumer", {uid: uid});
    }

    const deleteConsumer = () => {
        dispatch("deleteConsumer", {uid: focusConsumer});
    }

    const setFocusConsumer = (uid: string) => {
        focusConsumer = uid;
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
                    <button type="button" class="btn btn-sm btn-shadow-none" id="delete-consumer" data-bs-toggle="modal" data-bs-target="#confirm-dialog" on:click={() => setFocusConsumer(consumer.uid)}>
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
                        <b>Wasserzähler: </b> {consumer.coldWaterOnly ? "Nur Kaltwasserzähler" : "Kalt- und Warmwasserzähler"}
                    </div>
                {/each}
            </div>  
        </div>
    </div>
{/if}

<div class="modal" tabindex="-1" id="confirm-dialog" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Löschen bestätigen</h5>
            </div>
            <div class="modal-body">
                <p>
                    Das Löschen eines Verbrauchers löscht auch alle damit verbundenen Zählerstände. Dieser
                    Schritt kann nicht rückgängig gemacht werden. Möchtest Du den Verbraucher wirklich löschen?
                </p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="confirm-no">Nein</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="confirm-yes" on:click={() => deleteConsumer()}>Ja</button>
            </div>
        </div>
    </div>
</div>