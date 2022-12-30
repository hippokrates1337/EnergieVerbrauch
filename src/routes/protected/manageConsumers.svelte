<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        if(!session.user) {
            return {
                status: 302,
                redirect: "/auth/login"
            };
        }

        // Load user's observation units (to be passed into props)
        let res = await fetch("/protected/consumers/" + session.user.uid);
        let consumers;
        if(res.ok) {
            consumers = await res.json();
        }

        // Load user's observations (to be passed into props)
        res = await fetch("/protected/readings/" + session.user.uid);
        let readings;
        if(res.ok) {
            readings = await res.json();
        }

        return {
            status: 200,
            props: {
                consumers: consumers.data,
                readings: readings.data
            }
        };
    }
</script>

<script lang="ts">
    import { send } from "$lib/api";
    import ListConsumers from "$lib/components/ListConsumers.svelte";
    import AddConsumer from "$lib/components/AddConsumer.svelte";

    export let consumers: Consumer[];
    export let readings: Reading[];
    let addConsumerError: string = "";
    let editMode: boolean = false;
    let currentValues: Consumer;

    const addOrUpdateConsumer = async (form: HTMLFormElement) => {
        if(!editMode) {
            const response = await send(form);
        
            if(response.error) {
                addConsumerError = response.error;
            }

            if(response.success) {
                const newConsumer = response.data;
                consumers = [...consumers, newConsumer];
                form.reset();
            }
        } else {
            let response = await fetch("/protected/consumers/" + currentValues.uid, {
                method: "PATCH",
                body: JSON.stringify({
                    newName: form.elements["consumerName"].value,
                    newArea: form.elements["consumerArea"].value,
                    newAdults: form.elements["consumerAdults"].value,
                    newChildren: form.elements["consumerChildren"].value
                    })
                });

            if(!response.ok) {
                addConsumerError = (await response.json()).error;
            }

            // Update list of consumers
            response = await fetch("/protected/consumers/" + currentValues.user);
            if(response.ok) {
                consumers = (await response.json()).data;
                consumers.sort((a, b) => {
                    return a.createdAt > b.createdAt ? 1 : -1;
                });
            }
        }        
    }

    const editConsumer = async (reference: {uid: string}) => {
        editMode = !editMode;
        currentValues = consumers.filter(c => c.uid == reference.uid)[0];
    }
</script>


<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Verbraucher verwalten</p>

<ListConsumers {consumers} {readings} on:editConsumer={e => editConsumer(e.detail)}/>
<hr style="border-top: 3px double #8c8b8b">
<AddConsumer {editMode} {currentValues} on:addOrUpdate={e => addOrUpdateConsumer(e.detail)} {addConsumerError}/>



