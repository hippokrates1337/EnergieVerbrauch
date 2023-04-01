<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        if(!session.user?.uid || session.user.cookie_consent_level["strictly-necessary"] == undefined || session.user.cookie_consent_level["strictly-necessary"] == false) {
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
                    newType: form.elements["consumerType"].value,
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

    const deleteConsumer = async (reference: {uid: string}) => {
        let response = await fetch("/protected/consumers/" + reference.uid, {
                method: "DELETE"
                });

        if(!response.ok) {
            console.log((await response.json()).error);
        }

        consumers = consumers.filter(c => c.uid != reference.uid);
    }
</script>


<p class="text-start h1 fw-bold mx-1 mx-md-4 mt-4">Verbraucher verwalten</p>
<p class="text-start fw-light mx-1 mx-md-4">
    Ein "Verbraucher" ist eine Einheit für die der Energieverbrauch gemessen werden soll. 
    Zum Beispiel eine Eigentumswohnung oder eine Ferienwohnung. Zur besseren Vergleichbarkeit
    können pro Verbraucher auch die (Wohn)Fläche und die Anzahl der nutzenden Personen hinterlegt werden.
</p>
<p class="text-start fw-light mx-1 mx-md-4 mb-5">
    Auf dieser Seite kannst Du alle von Dir angelegten Verbraucher sehen und ihre Daten überprüfen/aktualisieren. 
    Klicke hierzu auf den Stift neben dem Namen des Verbrauchers und gib unten die neuen Werte ein.
</p>

<ListConsumers {consumers} {readings} on:editConsumer={e => editConsumer(e.detail)} on:deleteConsumer={e => deleteConsumer(e.detail)}/>
<hr style="border-top: 3px double #8c8b8b">
<AddConsumer {editMode} {currentValues} on:addOrUpdate={e => addOrUpdateConsumer(e.detail)} {addConsumerError}/>



