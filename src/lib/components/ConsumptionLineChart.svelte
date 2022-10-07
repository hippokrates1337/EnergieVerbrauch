<script lang="ts">
    export let obsUnits: ObservationUnit[];
    export let observations: Observation[];

    // Determine first and last date to show
    let startDate = observations.map(obs => obs.startDate).sort((a, b) => new Date(a) - new Date(b))[0];
    let endDate = observations.map(obs => obs.endDate).sort((a, b) => new Date(b) - new Date(a))[0];
    let minValue = observations.map(obs => obs.value).sort((a, b) => a - b)[0];
    let maxValue = observations.map(obs => obs.value).sort((a, b) => b - a)[0];
</script>

<p>
    Start date: {startDate} <br>
    End date: {endDate} <br>
    Min value: {minValue} <br>
    Max value: {maxValue}
</p>