<script lang="ts">
    export let obsUnits: ObservationUnit[];
</script>

<div class="row">
    <div class="col-4">
        <div class="list-group list-group-light" id="listTab" role="tablist">
            {#each obsUnits as unit, i}
                <a class="list-group-item list-group-item-action px-3 border-0 {i == 0 ? 'active' : ''}" id="list{unit.name}List" data-mdb-toggle="list" href="#list{unit.name}" role="tab" aria-controls="list{unit.name}">{unit.name}</a>
            {/each}
        </div>
    </div>
    <div class="col-8">
        <div class="tab-content" id="navTabContent">
            {#each obsUnits as unit, i}
                <div class="tab-pane fade {i == 0 ? 'active show' : ''}" id="list{unit.name}" role="tabpanel" aria-labelledby="list{unit.name}List">
                    {unit.name}
                </div>
            {/each}
        </div>
    </div>
</div>


