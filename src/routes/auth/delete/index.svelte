<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = ({ session, props }) => {
        if(session.user?.uid == "") {
            return {
                status: 302,
                redirect: "/"
            };
        }

        return { props };
    }
</script>

<script lang="ts">
    import { goto } from "$app/navigation";
	import { session } from "$app/stores";

    export let error: string = "";

    const deleteUser = async (event: SubmitEvent) => {
        const formElement = event.target as HTMLFormElement;
        let response = await fetch("/auth/delete", {
            method: "DELETE",
            body: JSON.stringify({
                userName: formElement.elements["userName"].value,
                password: formElement.elements["password"].value
            })
        });

        error = "";

        if(!response.ok) {
            error = (await response.json()).error;
            formElement.reset();
        } else {
            $session.user.uid = "";
            $session.user.userName = "";
            goto("/");
        }
    }
</script>

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Benutzerkonto löschen</p>
<p class="">
    Die Löschung Deines Benutzerkontos kann nicht rückgängig gemacht werden. Bitte gib daher zur Sicherheit noch
    einmal Deinen Benutzernamen und Dein Passwort ein.
</p>

<form class="mx-1 mx-md-4" on:submit|preventDefault={deleteUser} method="post" autocomplete="off">
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
        <button class="btn btn-danger btn-lg" type="submit" aria-label="Submit login data">Löschen bestätigen</button>
    </div>
</form>

{#if error}
    <p class="text-danger">{error}</p>
{/if}

<p>
    Passwort vergessen? Klicke <a href="/auth/pwdreset">hier</a>.
</p>