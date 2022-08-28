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

        return {
            status: 200,
            props: {
                obsUnits: units.data
            }
        };
    }
</script>

<script lang="ts">
    import { send } from "$lib/api";
    import ListObservationUnits from "$lib/components/ListObservationUnits.svelte";
    import AddObservationUnit from "$lib/components/AddObservationUnit.svelte";

    export let obsUnits: ObservationUnit[];
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
</script>

<h2>Verbraucher verwalten</h2>

<AddObservationUnit on:add={e => addUnit(e.detail)} {addUnitError}/>
<ListObservationUnits {obsUnits}/>
