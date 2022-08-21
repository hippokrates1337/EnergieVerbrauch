<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        if(!session.user) {
            return {
                status: 302,
                redirect: "/auth/login"
            };
        }

        const res = await fetch("/protected/obsunits");
        let units: ObservationUnit[] = [];
        if(res.ok) {
            units = await res.json();
        }

        return {
            status: 200,
            props: {
                user: session.user.userName,
                obsUnits: units.data
            }
        };
    }
</script>

<script lang="ts">
    import { send } from "$lib/api";

    export let user: string;
    export let obsUnits: ObservationUnit[];
    let addUnitError = ""

    const addUnit = async (event: SubmitEvent) => {
        addUnitError = ""

        const formElement = event.target as HTMLFormElement;
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

<h1>Innerer Bereich</h1>

<h2>Hinterlegte Beobachtungseinheiten</h2>
<!-- TO DO: Show all existing observation units-->
<ul>
    {#each obsUnits as unit}
        <li>{unit.name}</li>
    {/each}
</ul>

<form on:submit|preventDefault={addUnit} action="/protected/obsunits" method="post" autocomplete="off">
    <label for="unitName">Name: </label>
    <input type="text" id="unitName" name="unitName" required aria-label="Name der Beobachtungseinheit"/>
    <button type="submit" aria-label="Neue Beobachtungseinheit hinzufügen">Hinzufügen</button>
</form>

{#if addUnitError}
    <p>{addUnitError}</p>
{/if}