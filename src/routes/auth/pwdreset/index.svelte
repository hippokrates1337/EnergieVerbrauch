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
    import { send } from "$lib/api";
    
    export let error: string;
    export let success: string;

    const pwdReset = async (event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        const response = await send(formElement);

        error = "";
        success = "";

        if(response.error) {
            error = response.error;
        }

        if(response.success) {
            success = response.success;
            formElement.reset();
        }
    }
</script>

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Passwort zurücksetzen</p>

<form class="mx-1 mx-md-4" on:submit|preventDefault={pwdReset} method="post" autocomplete="off">
    <div class="d-flex flex-row align-items-center mb-4">
        <i class="fa fa-user fa-lg me-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input class="form-control" placeholder="E-Mail-Adresse" type="text" id="email" name="email" required aria-label="Specify your user name" />
        </div>
    </div>

    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
        <button class="btn btn-primary btn-lg" type="submit" aria-label="Passwort zurücksetzen">Zurücksetzen</button>
    </div>
</form>

{#if error}
    <p class="text-danger">{error}</p>
{/if}

{#if success}
    <p class="text-success">
        Dein altes Passwort wurde durch ein neues, zufällig generiertes ersetzt. Dieses wurde Dir per E-Mail zugesendet.
        Bitte <a href="/auth/login">melde Dich mit diesem Passwort an</a> und ersetze es umgehend durch ein neues, von Dir gewähltes Passwort.
    </p>
{/if}