<script lang="ts">
    import { session } from "$app/stores";

</script>
<svelte:head>
    <title>Energieverbrauch vergleichen</title>
</svelte:head>

<nav class="navbar navbar-expand-lg navbar-dark p-1" style="background-color:darkgreen;">
    <span class="navbar-brand">PLACEHOLDER</span>
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
                    <a class="dropdown-item" href="/protected/manageObsUnits">Verbraucher verwalten</a>
                    <a class="dropdown-item" href="/protected/manageObservations">Verbrauchswerte verwalten</a>
                </div>
            </li>
        </ul>
        <ul class="navbar-nav ms-auto">
            {#if !$session.user}
            <li class="nav-item">
                <a class="nav-link" href="/auth/register">Registrieren</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/auth/login">Anmelden</a>
            </li>
            {/if}
            {#if $session.user}
            <li class="nav-item">
                <a class="nav-link" href="/auth/logout">Abmelden</a>
            </li>
            {/if}
        </ul>
    </div>
</nav>

<slot />
