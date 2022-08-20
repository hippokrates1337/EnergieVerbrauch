<script lang="ts">
    import { session } from "$app/stores";

</script>
<svelte:head>
    <title>Energieverbrauch vergleichen</title>
</svelte:head>

<h1>Vergleiche Deinen Energieverbrauch</h1>

{#if !$session.user}
<a href="/auth/register">Registrieren</a>
<a href="/auth/login">Anmelden</a>
{/if}

{#if $session.user}
<a href="/auth/logout">Abmelden</a>
<a href="/protected">Innerer Bereich</a>
{/if}
