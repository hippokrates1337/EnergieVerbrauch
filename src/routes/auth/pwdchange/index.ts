import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";
import * as bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";

const db = new PrismaClient();
const saltRounds = 10;

export const POST: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.formData();
    const oldPwd = data.get("password") as string;
    const newPwd = data.get("newPwd") as string;
    const newPwdRepeat = data.get("newPwdRepeat") as string;

    if(newPwd != newPwdRepeat) {
        return {
            status: 400,
            body: {
                error: "Neues Passwort stimmt nicht zwischen beiden Feldern überein."
            }
        };
    }

    if(oldPwd == newPwd) {
        return {
            status: 400,
            body: {
                error: "Altes und neues Passwort sind identisch."
            }
        };
    }

    // Find user based on email address
    const user = await db.user.findUnique({
        where: {
            uid: event.locals.user?.uid
        }
    }) as User;

    if(!user) {
        return {
            status: 400,
            body: {
                error: "Benutzer nicht gefunden."
            }
        };
    }

    const passwordMatch = (await bcrypt.compare(oldPwd, user.passwordHash));
    if(!passwordMatch) {
        return {
            status: 400,
            body: {
                error: "Falsches Passwort angegeben."
            }
        };
    }

    try {
        // Reset password in database
        await db.user.updateMany({
            where: {
                uid: user.uid
            },
            data: {
                passwordHash: await bcrypt.hash(newPwd, saltRounds)
            }
        });

        // Send password to user via email
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        const msg = {
            to: user.email,
            from: 'j.weber_2003@web.de',
            subject: 'VerbrauchsVergleich - Neues Passwort',
            html: 'Liebe(r) ' + user.name + ', <br> <br> Du hast ein neues Passwort vergeben. Dieses Passwort ist: <br> <br>' + newPwd + '<br> <br> Weiterhin viel Spaß auf der Plattform.',
        }

        await sgMail.send(msg);
    } catch(error) {
        return {
            status: 400,
            body: {
                error: "Fehler beim Setzen des neuen Passworts. Fehlermeldung: " + error
            }
        };
    }
    
    return {
        status: 200,
        body: {
            success: "Passwort erfolgreich aktualisiert."
        }
    }
}