<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ session, fetch }) => {
        if(!session.user) {
            return {
                status: 302,
                redirect: "/auth/login"
            };
        }

        console.log(session.user.cookie_consent_level);

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
                consumers: consumers.data,
                readings: readings.data
            }
        };
    }
</script>

<script lang="ts">
    export let userName: string;
    export let consumers: Consumer[];
    export let readings: Reading[];
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>