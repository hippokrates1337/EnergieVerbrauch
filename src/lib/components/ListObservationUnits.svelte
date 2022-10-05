<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let obsUnits: ObservationUnit[];
    export let observations: Observation[];
    let showEdit: boolean = false;
    let newUnitName: string;

    const toggleEdit = () => {
        showEdit = !showEdit;
    }

    const changeObsUnitName = (uid: string, newName: string) => {
        dispatch("changeName", {
            uid: uid,
            newName: newName
        });
        newUnitName = "";
    }
</script>

{#if obsUnits.length > 0}
    <div class="row p-3 mb-3">
        <div class="col-4">
            <div class="list-group list-group-light" id="listTab" role="tablist">
                {#each obsUnits as unit, i}
                    <a class="list-group-item list-group-item-action border-0 {i == 0 ? 'active' : ''}" id="list{i}Link" data-bs-toggle="list" href="#list{i}" role="tab" aria-controls="list{i}">{unit.name}</a>
                {/each}
            </div>
        </div>
        <div class="col-8">
            <div class="tab-content" id="navTabContent">
                {#each obsUnits as unit, i}
                    <div class="tab-pane fade {i == 0 ? 'active show' : ''} border-0" id="list{i}" role="tabpanel" aria-labelledby="list{i}">
                        <b>Name:</b> {unit.name}
                        <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => toggleEdit()}><i class="fa fa-pencil"></i></button>
                        {#if showEdit}
                            <input type="text" bind:value={newUnitName}/>
                            <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => changeObsUnitName(unit.uid, newUnitName)}><i class="fa fa-floppy-o"></i></button>
                        {/if}
                        <br>
                        <b>Hinzugefügt am:</b> {new Date(unit.createdAt).toDateString()}<br>
                        <b>Hinterlegte Verbrauchswerte:</b> {observations.filter(e => e.obsUnit == unit.name).length}
                    </div>
                {/each}
            </div>  
        </div>
    </div>
{/if}

