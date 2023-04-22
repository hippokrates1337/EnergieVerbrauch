<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = ({ session, props }) => {
        if(session.user?.uid != "") {
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
    
    export let error: string = "";

    const login = async (event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        const response = await send(formElement);

        error = "";

        if(response.error) {
            error = response.error;
        }

        $session.user.uid = response.user?.uid;
        $session.user.userName = response.user?.userName;

        formElement.reset();
    }
</script>

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Anmelden</p>

<form class="mx-1 mx-md-4" on:submit|preventDefault={login} method="post" autocomplete="off">
    <div class="d-flex flex-row align-items-center mb-4">
        <i class="fa fa-user fa-lg me-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input class="form-control" placeholder="Benutzername" type="text" id="userName" name="userName" required aria-label="Specify your user name" />
        </div>
    </div>

    <div class="d-flex flex-row align-items-center mb-4">
        <i class="fa fa-lock fa-lg me-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input placeholder="Passwort" class="form-control" type="password" id="password" name="password" required aria-label="Provide your password" />
        </div>
    </div>

    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
        <button class="btn btn-primary btn-lg" type="submit" aria-label="Submit login data">Anmelden</button>
    </div>
</form>

{#if error}
    <p class="text-danger">{error}</p>
{/if}

<p>
    Passwort vergessen? Klicke <a href="/auth/pwdreset">hier</a>.
</p>