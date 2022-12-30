<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import dayjs from "dayjs";
    import EnterReading from "$lib/components/EnterReading.svelte";

    export let consumers: Consumer[];
    export let readings: Reading[];
    export let title: string;
    export let changeReadingError: string;
    export let userid: string;
    let showEdit: boolean = false;
    let editedReading: string;
    let newConsumer: string, newType: string, newDate: string, newValue: number;

    const deleteReading = (uid: string) => {
        dispatch("delete", uid);
    }

    const toggleEdit = (reading: Reading) => {
        showEdit = !showEdit;
        editedReading = reading.uid;
        newConsumer = reading.consumer;
        newType = reading.type;
        newDate = dayjs(reading.date).format("YYYY-MM-DD");
        newValue = reading.value;
    }

    const changeReading = async(event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        dispatch("change", formElement);
        showEdit = false;
    }
</script>

<p class="text-start h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">{title}</p>
<ul class="mx-1 mx-md-4 mt-4">
    {#each readings as reading}
    <li>
        {consumers.find((a) => a.uid == reading.consumer)?.name} - {new Date(reading.date).toLocaleDateString()}: {reading.value} {reading.type == "electricity" ? "kWh" : "m3"}
        <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => deleteReading(reading.uid)}><i class="fa fa-trash"></i></button>
        <button type="button" class="btn btn-sm btn-shadow-none" on:click={() => toggleEdit(reading)}><i class="fa fa-pencil"></i></button>
        {#if (showEdit || changeReadingError) && reading.uid == editedReading}
            <form on:submit|preventDefault={changeReading} action={"/protected/readings/" + userid + "?uid=" + reading.uid} method="post" autocomplete="off">
                <EnterReading {consumers} 
                defaultConsumer={newConsumer} 
                defaultType={newType} 
                defaultDate={newDate}
                defaultValue={newValue} />
            </form>
            {#if changeReadingError}
                <p class="text-danger">{changeReadingError}</p>
            {/if}
        {/if}
    </li>
    {/each}
</ul>