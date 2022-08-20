<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = ({ session, props }) => {
        if(session.user) {
            return {
                status: 302,
                redirect: "/"
            };
        }

        return { props };
    }
</script>

<script lang="ts">
    import { session } from "$app/stores";
    import { send } from "$lib/api";
    
    export let error: string;

    const login = async (event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        const response = await send(formElement);

        if(response.error) {
            error = response.error;
        }

        $session.user = response.user;

        formElement.reset();
    }
</script>

<form on:submit|preventDefault={login} method="post" autocomplete="off">
    <label for="userName">Benutzername: </label>
    <input type="text" id="userName" name="userName" required aria-label="Specify your user name" />
    <label for="password">Passwort: </label>
    <input type="text" id="password" name="password" required aria-label="Select a password" />
    <button aria-label="Submit user registration">Registrieren</button>
</form>

{#if error}
    <p>{error}</p>
{/if}