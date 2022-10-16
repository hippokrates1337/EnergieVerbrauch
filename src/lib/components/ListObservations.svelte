<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import dayjs from "dayjs";
    import EnterObservation from "$lib/components/EnterObservation.svelte";

    export let observations: Observation[];
    export let obsUnits: ObservationUnit[];
    export let title: string;
    export let changeObservationError: string;
    export let userid: string;
    let showEdit: boolean = false;
    let editedObs: string;
    let newObsUnit: string, newType: string, newStartDate: string, newEndDate: string, newValue: number;

    const deleteObs = (uid: string) => {
        dispatch("delete", uid);
    }

    const toggleEdit = (obs: Observation) => {
        showEdit = !showEdit;
        editedObs = obs.uid;
        newObsUnit = obs.obsUnit;
        newType = obs.type;
        newStartDate = dayjs(obs.startDate).format("YYYY-MM-DD");
        newEndDate = dayjs(obs.endDate).format("YYYY-MM-DD");
        newValue = obs.value;
    }

    const changeObservation = async(event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        dispatch("change", formElement);
    }
</script>

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">{title}</p>
<ul>
    {#each observations as obs}
    <li>
        {obsUnits.find((a) => a.uid == obs.obsUnit)?.name} - {new Date(obs.startDate).toLocaleDateString()} - {new Date(obs.endDate).toLocaleDateString()}: {obs.value} {obs.unit}
        <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => deleteObs(obs.uid)}><i class="fa fa-trash"></i></button>
        <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => toggleEdit(obs)}><i class="fa fa-pencil"></i></button>
        {#if showEdit && obs.uid == editedObs}
            <form on:submit|preventDefault={changeObservation} action={"/protected/observations/" + userid + "?uid=" + obs.uid} method="post" autocomplete="off">
                <EnterObservation {obsUnits} 
                defaultObsUnit={newObsUnit} 
                defaultObsType={newType} 
                defaultStartDate={newStartDate}
                defaultEndDate={newEndDate} 
                defaultValue={newValue} />
            </form>
            {#if changeObservationError}
                <p class="text-danger">{changeObservationError}</p>
            {/if}
        {/if}
    </li>
    {/each}
</ul>