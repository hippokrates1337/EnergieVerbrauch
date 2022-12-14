<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        if(!session.user) {
            return {
                status: 302,
                redirect: "/auth/login"
            };
        }

        // Load user's consumers (to be passed into props)
        let res = await fetch("/protected/consumers/" + session.user.uid);
        let consumers;
        if(res.ok) {
            consumers = await res.json();
        }

        // Load user's readings (to be passed into props)
        res = await fetch("/protected/readings/" + session.user.uid);
        let readings;
        if(res.ok) {
            readings = await res.json();
        }

        return {
            status: 200,
            props: {
                consumers: consumers.data,
                readings: readings.data,
                userid: session.user.uid
            }
        };
    }
</script>

<script lang="ts">
    import { send } from "$lib/api";
    import ListReadings from "$lib/components/ListReadings.svelte";
    import AddReading from "$lib/components/AddReading.svelte";

    export let consumers: Consumer[];
    export let readings: Reading[];
    export let userid: string;
    
    let addReadingError: string = "";
    let changeReadingError: string = "";

    const addReading = async (formElement: HTMLFormElement) => {
        addReadingError = "";

        const response = await send(formElement);

        if(response.error) {
            addReadingError = response.error;
        }

        if(response.success) {
            const newReading = response.data;
            readings = [...readings, newReading];
            formElement.reset();
        }
    }

    const deleteReading = async (uid: String) => {
        let response = await fetch("/protected/readings/" + userid + "?uid=" + uid, {
            method: "DELETE"
        });

        response = await fetch("/protected/readings/" + userid);
        if(response.ok) {
            readings = (await response.json()).data;
        }
    }

    const changeReading = async (formElement: HTMLFormElement) => {
        changeReadingError = "";

        const response = await send(formElement, "PATCH");

        if(response.success) {
            const res = await fetch("/protected/readings/" + userid);
            if(res.ok) {
                readings = (await res.json()).data;
            }
        } else {
            changeReadingError = response.error as string;
        }
    }
</script>

<p class="text-start h1 fw-bold mx-1 mx-md-4 mt-4">Z??hlerst??nde verwalten</p>
<p class="text-start fw-light mx-1 mx-md-4">
    Auf dieser Seite kannst Du f??r Deine einzelnen "Verbraucher" die Z??hlerst??nde f??r Strom, Kaltwasser und Warmwasser
    hinterlegen. Diese werden automatisch in t??gliche Verbrauchswerte umgerechnet, sobald mehr als zwei Z??hlerst??nde 
    vorhanden sind.
</p>
<p class="text-start fw-light mx-1 mx-md-4 mb-5">
    Bereits hinterlegte Z??hlerst??nde kannst Du anpassen, indem Du auf den Stift links des jeweiligen Wertes klickst. 
    Durch einen Klick auf den M??lleimer l??schst Du den jeweiligen Wert.
</p>

<AddReading {consumers} {addReadingError} on:add={e => addReading(e.detail)}/>
<hr style="border-top: 3px double #8c8b8b">
{#each ["coldWater", "warmWater", "electricity"] as type}
<ListReadings 
    title={type == "coldWater" ? "Kaltwasser" : (type == "warmWater" ? "Warmwasser" : "Strom")} 
    readings={readings.filter(a => a.type == type)} 
    {consumers} 
    {changeReadingError}
    {userid}
    on:delete={e => deleteReading(e.detail)} 
    on:change={e => changeReading(e.detail)} />
{/each}