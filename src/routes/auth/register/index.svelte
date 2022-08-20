<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = ({ session, props }) => {
        // If a user is logged in, they should not be able to access the registration page
        if(session.user) {
            return {
                status: 302,
                location: "/"
            };
        }

        return { props };
    }
</script>

<script lang="ts">
    import { send } from "$lib/api";

    export let error: string;
    export let success: string;

    const register = async (event: SubmitEvent) => {
        error = "";
        success = "";

        const formElement = event.target as HTMLFormElement;
        const response = await send(formElement);

        if(response.error) {
            error = response.error;
        }

        if(response.success) {
            success = response.success;
            formElement.reset();
        }
    }
</script>

<svelte:head>
    <title>Neuen benutzer registrieren</title>
</svelte:head>

<h1>Anmeldung als neuer Benutzer</h1>

<div>
    <form on:submit|preventDefault={register} method="post" autocomplete="off">
        <label for="userName">Benutzername: </label>
        <input type="text" id="userName" name="userName" required aria-label="Specify your user name" />
        <label for="email">E-Mail-Adresse: </label>
        <input type="text" id="email" name="email" required aria-label="Provide an email address" />
        <label for="password">Passwort: </label>
        <input type="text" id="password" name="password" required aria-label="Select a password" />
        <label for="passwordRepeat">Passwort wiederholen: </label>
        <input type="text" id="passwordRepeat" name="passwordRepeat" required aria-label="Repeat password" />
        <button aria-label="Submit user registration">Registrieren</button>
    </form>
</div>

{#if error}
<p>{error}</p>
{/if}

{#if success}
<div>
    <p>Erfolgreich als neuer Benutzer registriert.</p>
    <p>Du kannst Dich nun <a href="/auth/login">einloggen</a>.</p>
</div>
{/if}

<a href="/.">Home</a>