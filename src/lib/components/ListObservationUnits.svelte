<script lang="ts">
    export let obsUnits: ObservationUnit[];
</script>

<ul>
    {#each obsUnits as unit}
        <li>{unit.name}</li>
    {/each}
</ul>

