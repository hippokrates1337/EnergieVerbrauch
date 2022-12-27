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
    let addConsumerError = "";

    const addConsumer = async (formElement: HTMLFormElement) => {
        const response = await send(formElement);
        
        if(response.error) {
            addConsumerError = response.error;
        }

        if(response.success) {
            const newConsumer = response.data;
            consumers = [...consumers, newConsumer];
            formElement.reset();
        }
    }

    const changeConsumerName = async (change: {uid: string, newName: string}) => {
        let response = await fetch("/protected/consumers/" + change.uid, {
            method: "PATCH",
            body: JSON.stringify({
                newName: change.newName
            })
        });

        // Update list of consumers
        response = await fetch("/protected/consumers");
        if(response.ok) {
            consumers = (await response.json()).data;
            consumers.sort((a, b) => {
                return a.createdAt > b.createdAt ? 1 : -1;
            });
        }
    }
</script>


<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Verbraucher verwalten</p>

<ListConsumers {consumers} {readings} on:changeName={e => changeConsumerName(e.detail)}/>
<hr style="border-top: 3px double #8c8b8b">
<AddConsumer on:add={e => addConsumer(e.detail)} {addConsumerError}/>



