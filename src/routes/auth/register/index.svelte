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

<div class="container border border-secondary p-3 mt-5">
    <h3 class="text-dark">Als neuer Benutzer anmelden</h3>
    <form on:submit|preventDefault={register} method="post" autocomplete="off">
        <div class="row mb-2">
            <div class="col">
                <div class="form-floating">
                    <input placeholder="Benutzername" class="form-control" type="text" id="userName" name="userName" required aria-label="Specify your user name" />
                    <label for="userName">Benutzername</label>
                </div>
            </div>
            <div class="col">
                <div class="form-floating">
                    <input placeholder="E-Mail-Adresse" class="form-control" type="text" id="email" name="email" required aria-label="Provide an email address" />
                    <label for="email">E-Mail-Adresse</label>
                </div>
            </div>
        </div>
        <div class="row mb-2">
            <div class="col">
                <div class="form-floating">
                    <input placeholder="Passwort" class="form-control" type="password" id="password" name="password" required aria-label="Select a password" />
                    <label for="password">Passwort</label>
                </div>
            </div>
            <div class="col">
                <div class="form-floating">
                    <input placeholder="Passwort wiederholen" class="form-control" type="password" id="passwordRepeat" name="passwordRepeat" required aria-label="Repeat password" />
                    <label for="passwordRepeat">Passwort wiederholen</label>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="float-end">
                    <button class="btn btn-secondary" type="submit" aria-label="Submit user registration">Registrieren</button>
                </div>
            </div>
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
</div>