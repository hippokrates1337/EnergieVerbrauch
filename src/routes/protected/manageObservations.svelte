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
        let res = await fetch("/protected/obsunits");
        let units;
        if(res.ok) {
            units = await res.json();
        }

        // Load user's observations (to be passed into props)
        res = await fetch("/protected/observations/" + session.user.uid);
        let obs;
        if(res.ok) {
            obs = await res.json();
        }

        return {
            status: 200,
            props: {
                obsUnits: units.data,
                observations: obs.data,
                userid: session.user.uid
            }
        };
    }
</script>

<script lang="ts">
    import { send } from "$lib/api";
    import ListObservations from "$lib/components/ListObservations.svelte";
    import AddObservation from "$lib/components/AddObservation.svelte";

    export let obsUnits: ObservationUnit[];
    export let observations: Observation[];
    export let userid: string;
    
    let addObservationError: string = "";
    let changeObservationError: string = "";

    const addObservation = async (formElement: HTMLFormElement) => {
        addObservationError = "";

        const response = await send(formElement);

        if(response.error) {
            addObservationError = response.error;
        }

        if(response.success) {
            const newObs = response.data;
            observations = [...observations, newObs];
            formElement.reset();
        }
    }

    const deleteObservation = async (uid: String) => {
        let response = await fetch("/protected/observations/" + userid + "?uid=" + uid, {
            method: "DELETE"
        });

        response = await fetch("/protected/observations/" + userid);
        if(response.ok) {
            observations = (await response.json()).data;
        }
    }

    const changeObservation = async (formElement: HTMLFormElement) => {
        changeObservationError = "";

        const response = await send(formElement, "PATCH");

        if(response.success) {
            const res = await fetch("/protected/observations/" + userid);
            if(res.ok) {
                observations = (await res.json()).data;
            }
        }
    }
</script>

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Verbrauchswerte verwalten</p>

<AddObservation {obsUnits} {addObservationError} on:add={e => addObservation(e.detail)}/>
<hr style="border-top: 3px double #8c8b8b">
<ListObservations 
    title="Kaltwasser" 
    observations={observations.filter(a => a.type == "coldWater")} 
    {obsUnits} 
    {changeObservationError}
    {userid}
    on:delete={e => deleteObservation(e.detail)} 
    on:change={e => changeObservation(e.detail)} />
    
<ListObservations 
    title="Warmwasser" 
    observations={observations.filter(a => a.type == "warmWater")} 
    {obsUnits} 
    {changeObservationError} 
    {userid}
    on:delete={e => deleteObservation(e.detail)} 
    on:change={e => changeObservation(e.detail)} />

<ListObservations 
    title="Strom" 
    observations={observations.filter(a => a.type == "electricity")} 
    {obsUnits} 
    {changeObservationError}
    {userid}
    on:delete={e => deleteObservation(e.detail)} 
    on:change={e => changeObservation(e.detail)} />
