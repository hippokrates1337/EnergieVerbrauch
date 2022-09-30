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

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Neuer Benutzer</p>

<form class="mx-1 mx-md-4" on:submit|preventDefault={register} method="post" autocomplete="off">
    <div class="d-flex flex-row align-items-center mb-4">
        <i class="fa fa-user fa-lg me-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input class="form-control" placeholder="Benutzername" type="text" id="userName" name="userName" required aria-label="Specify your user name" />
        </div>
    </div>

    <div class="d-flex flex-row align-items-center mb-4">
        <i class="fa fa-envelope fa-lg me-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input class="form-control" placeholder="E-Mail-Adresse" type="text" id="email" name="email" required aria-label="Provide an email address" />
        </div>
    </div>

    <div class="d-flex flex-row align-items-center mb-4">
        <i class="fa fa-lock fa-lg me-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input placeholder="Passwort" class="form-control" type="password" id="password" name="password" required aria-label="Select a password" />
        </div>
    </div>

    <div class="d-flex flex-row align-items-center mb-4">
        <i class="fa fa-key fa-lg me-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input placeholder="Passwort wiederholen" class="form-control" type="password" id="passwordRepeat" name="passwordRepeat" required aria-label="Repeat password" />
        </div>
    </div>

    <div class="form-check d-flex justify-content-center mb-5">
        <input class="form-check-input me-2" type="checkbox" required value="consent" id="consent" />
        <label class="form-check-label" for="consent">
            Ich stimme zu, dass alle meine Angaben für Zwecke dieser Webseite genutzt werden können.
        </label>
    </div>

    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
        <button class="btn btn-primary btn-lg" type="submit" aria-label="Submit user registration">Registrieren</button>
    </div>
</form>

{#if error}
    <p class="text-danger">{error}</p>
{/if}

{#if success}
<div>
    <p class="text-success">Erfolgreich als neuer Benutzer registriert. Du kannst Dich nun <a href="/auth/login">einloggen</a>.</p>
</div>
{/if}