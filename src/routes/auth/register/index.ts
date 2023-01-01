import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";
import * as bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";

const db = new PrismaClient();
const saltRounds = 10;

export const POST: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.formData();
    const userName = data.get("userName");
    const email = data.get("email");
    const password = data.get("password");
    const passwordRepeat = data.get("passwordRepeat");

    if(typeof userName !== "string" || typeof email !== "string" ||
        typeof password !== "string" || typeof passwordRepeat !== "string") {
        return {
            status: 400,
            body: {
                error: "Daten konnten nicht verarbeitet werden (Text erforderlich)."
            }
        };
    }

    if(!userName || !email || !password || !passwordRepeat) {
        return {
            status: 400,
            body: {
                error: "Alle Felder des Registrierungsformulars müssen befüllt werden."
            }
        };
    }

    if(password != passwordRepeat) {
        return {
            status: 400,
            body: {
                error: "Passwörter stimmen nicht überein."
            }
        };
    }

    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return {
            status: 400,
            body: {
                error: "Ungültige E-Mail-Adresse angegeben."
            }
        };
    }

    try {
        await db.user.create({
            data: {
                name: userName,
                email: email,
                passwordHash: await bcrypt.hash(password, saltRounds)   
            }
        });

        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        const msg = {
            to: email,
            from: 'j.weber_2003@web.de',
            subject: 'VerbrauchsVergleich - Registrierungsbestätigung',
            html: 'Willkommen ' + userName + ', <br> <br> Du hast Dich erfolgreich bei VerbrauchsVergleich registriert. Dein hinterlegtes Passwort ist: <br> <br>' + password + '<br> <br> Viel Spaß auf der Plattform!',
        }

        await sgMail.send(msg);

        return {
            status: 200,
            body: {
                success: "Nutzer erfolgreich registriert."
            }
        }
    } catch(error) {
        return {
            status: 400,
            body: {
                error: "Fehler bei der Registrierung. Fehlermeldung: " + error
            }
        };
    }
}