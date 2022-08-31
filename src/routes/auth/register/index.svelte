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
    <title>Als neuer Benutzer registrieren</title>
</svelte:head>

<div class="container border border-secondary p-3">
    <form on:submit|preventDefault={register} method="post" autocomplete="off">
        <div class="row mb-2">
            <div class="col">
                <input placeholder="Benutzername" class="form-control" type="text" id="userName" name="userName" required aria-label="Specify your user name" />
            </div>
            <div class="col">
                <input placeholder="E-Mail-Adresse" class="form-control" type="text" id="email" name="email" required aria-label="Provide an email address" />
            </div>
        </div>
        <div class="row mb-2">
            <div class="col">
                <input placeholder="Passwort" class="form-control" type="password" id="password" name="password" required aria-label="Select a password" />
            </div>
            <div class="col">
                <input placeholder="Passwort wiederholen" class="form-control" type="password" id="passwordRepeat" name="passwordRepeat" required aria-label="Repeat password" />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-secondary" type="submit" aria-label="Submit user registration">Registrieren</button>
            </div>
        </div>
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