<script lang="ts">
    export let obsUnits: ObservationUnit[];
    export let observations: Observation[];
    let showEdit:boolean = false;

    const toggleEdit = () => {
        showEdit == !showEdit;
        alert("This worked");
    }

</script>

<div class="row bg-light p-3">
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
                <div class="tab-pane fade {i == 0 ? 'active show' : ''} border-0 bg-light" id="list{i}" role="tabpanel" aria-labelledby="list{i}">
                    <b>Name:</b> {unit.name}
                    <i class="fa fa-pencil" on:click={toggleEdit}></i>
                    {#if showEdit}
                        <input type="text" />
                        <button type="submit">Ändern</button>
                    {/if}
                    <br>
                    <b>Hinzugefügt am:</b> {new Date(unit.createdAt).toDateString()}
                    <b>Hinterlegte Verbrauchswerte:</b> {observations.filter(e => e.obsUnit == unit.name).length}
                </div>
            {/each}
        </div>
    </div>
</div>


