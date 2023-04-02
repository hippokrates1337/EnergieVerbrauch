<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        if(session.user.uid == "" || session.user?.cookie_consent_level["strictly-necessary"] == undefined || session.user?.cookie_consent_level["strictly-necessary"] == false) {
            return {
                status: 302,
                redirect: "/auth/login"
            };
        }

        // Load user's observation units (to be passed into props)
        let res = await fetch("/protected/consumers/" + session.user.uid);
        let consumers;
        if(res.ok) {
            consumers = await res.json();
        }

        // Load user's observations (to be passed into props)
        res = await fetch("/protected/readings/" + session.user.uid);
        let readings;
        if(res.ok) {
            readings = await res.json();
        }

        return {
            status: 200,
            props: {
                userName: session.user.userName,
                userID: session.user.uid,
                consumers: consumers.data,
                readings: readings.data
            }
        };
    }
</script>

<script lang="ts">
    import { Confirm } from "svelte-confirm";

    export let userName: string;
    export let userID: string;
    export let consumers: Consumer[];
    export let readings: Reading[];

    const deleteUser = async (uid: string) => {
        let response = await fetch("/auth/delete/" + userID, {
            method: "DELETE"
        });
    }
</script>

<section class="vh-100">
    <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-md-10 col-lg-6 col-xl-5">
                <div class="card text-black" style="border-radius: 5px; background-color: #FAF9F6">
                    <div class="card-body p-md-5">
                        <div class="row">
                            Benutzername: {userName}<br>
                            Angelegte Verbraucher: {consumers.length}<br>
                            Hinterlegte Zählerstände: {readings.length}<br>
                        </div>
                        <div class="row mt-3">
                            <a href="/auth/pwdchange">Passwort ändern</a>
                        </div>
                        <div class="row mt-3">
                            <Confirm confirmTitle="Löschen" cancelTitle="Abbrechen" let:confirm="{confirmThis}">
                                <button type="button" class="btn btn-danger" on:click={() => confirmThis(deleteUser, userID)}>
                                    Account löschen
                                </button>
                                <span slot="title">
                                    Den Account wirklich unwiderruflich löschen?
                                </span>
                                <span slot="description">
                                    Dieser Schritt löscht alle Deine Daten und kann nicht rückgängig gemacht werden.
                                </span>
                            </Confirm>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>