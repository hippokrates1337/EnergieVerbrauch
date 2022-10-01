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
        res = await fetch("/protected/observations");
        let obs;
        if(res.ok) {
            obs = await res.json();
        }

        return {
            status: 200,
            props: {
                obsUnits: units.data,
                observations: obs.data
            }
        };
    }
</script>

<script lang="ts">
    import { send } from "$lib/api";
    import ListObservationUnits from "$lib/components/ListObservationUnits.svelte";
    import AddObservationUnit from "$lib/components/AddObservationUnit.svelte";

    export let obsUnits: ObservationUnit[];
    export let observations: Observation[];
    let addUnitError = "";

    const addUnit = async (formElement: HTMLFormElement) => {
        const response = await send(formElement);
        
        if(response.error) {
            addUnitError = response.error;
        }

        if(response.success) {
            const newUnit = response.data;
            obsUnits = [...obsUnits, newUnit];
            formElement.reset();
        }
    }

    const changeUnitName = async (change: {uid: string, newName: string}) => {
        let response = await fetch("/protected/obsunits", {
            method: "PATCH",
            body: JSON.stringify({
                uid: change.uid,
                newName: change.newName
            })
        });

        // Update list of observation units
        response = await fetch("/protected/obsunits");
        if(response.ok) {
            obsUnits = (await response.json()).data;
            obsUnits.sort((a, b) => {
                return a.createdAt > b.createdAt ? 1 : -1;
            });
        }
    }
</script>


<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Verbraucher verwalten</p>

<ListObservationUnits {obsUnits} {observations} on:changeName={e => changeUnitName(e.detail)}/>
<hr style="border-top: 3px double #8c8b8b">
<AddObservationUnit on:add={e => addUnit(e.detail)} {addUnitError}/>



