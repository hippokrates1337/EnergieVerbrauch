<svelte:head>
    <title>Neuen benutzer registrieren</title>
</svelte:head>

<h1>Anmeldung als neuer Benutzer</h1>

<div>
    <form action="" method="">
        <label for="userName">Benutzername: </label>
        <input type="text" name="userName" aria-label="Specify your user name" />
        <label for="email">E-Mail-Adresse: </label>
        <input type="text" name="email" aria-label="Provide an email address" />
        <label for="password">Passwort: </label>
        <input type="text" name="password" aria-label="Select a password" />
        <label for="passwordRepeat">Passwort wiederholen: </label>
        <input type="text" name="passwordRepeat" aria-label="Repeat password" />
        <button aria-label="Submit user registration">Registrieren</button>
    </form>
</div>

<a href="/.">Home</a>