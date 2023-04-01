<script lang="ts">
    import { session } from "$app/stores";

</script>
<svelte:head>
    <title>Energieverbrauch vergleichen</title>
</svelte:head>

<nav class="navbar navbar-expand-lg navbar-dark p-1 bg-dark fixed-top">
    <span class="navbar-brand"><img src="./VV_Logo.png" style="width: 35%; height: 35%" alt="VerbrauchsVergleich Logo"></span>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navharSupportedContent" aria-expanded="false" aria-label="Navigation ein- oder ausklappen">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto">
            <li class="nav-item">
                <a class="nav-link" href="/">Startseite</a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href={null} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Meine Daten</a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item" href="/protected">Übersicht</a>
                    <a class="dropdown-item" href="/protected/manageConsumers">Verbraucher verwalten</a>
                    <a class="dropdown-item" href="/protected/manageReadings">Zählerstände verwalten</a>
                </div>
            </li>
        </ul>
        <ul class="navbar-nav ms-auto">
            {#if !$session.user.uid != ""}
            <li class="nav-item">
                <a class="nav-link" href="/auth/register">Registrieren</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/auth/login">Anmelden</a>
            </li>
            {/if}
            {#if $session.user.uid != ""}
            <li class="nav-item">
                <a class="nav-link" href="/protected/account">Mein Konto</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/auth/logout">Abmelden</a>
            </li>
            {/if}
        </ul>
    </div>
</nav>


<div class="row mt-3 p-3">
    <div class="col"></div>
    <div class="col-md-12 col-lg-10 col-xl-8">
        <slot />
    </div>
    <div class="col"></div>
</div>

<footer class="bg-light fixed-bottom ps-3 pe-3">
    <div class="d-flex justify-content-between">
        <a href="/termsofuse">Nutzungsbedingungen</a>
        <a href="/dataprotection">Datenschutzerklärung</a>
        <a href="/imprint">Impressum</a>
    </div>
</footer>