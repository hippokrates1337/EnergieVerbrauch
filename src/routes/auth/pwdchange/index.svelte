<script lang="ts">
    import { send } from "$lib/api";
    
    export let error: string;
    export let success: string;

    const pwdChange = async (event: SubmitEvent) => {
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

<p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Passwort ändern</p>

<form class="mx-1 mx-md-4" on:submit|preventDefault={pwdChange} method="post" autocomplete="off">
    <div class="d-flex flex-row align-items-center mb-4">
        <i class="fa fa-key fa-lg me-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input placeholder="Altes Passwort" class="form-control" type="password" id="password" name="password" required aria-label="Provide your password" />
        </div>
    </div>

    <div class="d-flex flex-row align-items-center mb-4">
        <i class="fa fa-lock fa-lg me-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input placeholder="Neues Passwort" class="form-control" type="password" id="newPwd" name="newPwd" required aria-label="Provide your password" />
        </div>
    </div>

    <div class="d-flex flex-row align-items-center mb-4">
        <i class="fa fa-lock fa-lg me-3 fa-fw"></i>
        <div class="form-outline flex-fill mb-0">
            <input placeholder="Neues Passwort (Wiederholung)" class="form-control" type="password" id="newPwdRepeat" name="newPwdRepeat" required aria-label="Provide your password" />
        </div>
    </div>

    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
        <button class="btn btn-primary btn-lg" type="submit" aria-label="Passwort aktualisieren">Aktualisieren</button>
    </div>
</form>

{#if error}
    <p class="text-danger">{error}</p>
{/if}

{#if success}
    <p class="text-success">
        Passwort erfolgreich aktualisiert. Eine Bestätigung wurde Dir per E-Mail zugesandt.
    </p>
{/if}