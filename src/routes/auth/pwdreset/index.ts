import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";
import * as bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";

const db = new PrismaClient();
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const saltRounds = 10;

export const POST: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.formData();
    const email = data.get("email") as string;

    // Find user based on email address
    const user = await db.user.findUnique({
        where: {
            email: email
        }
    }) as User;

    if(!user) {
        return {
            status: 400,
            body: {
                error: "Kein Benutzer mit dieser E-Mail-Adresse gefunden."
            }
        };
    }

    // Generate random password
    let pwd = "";
    for(let i = 0; i < 50; i++) {
        pwd += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    try {
        // Reset password in database
        await db.user.updateMany({
            where: {
                uid: user.uid
            },
            data: {
                passwordHash: await bcrypt.hash(pwd, saltRounds)
            }
        });

        // Send password to user via email
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        const msg = {
            to: email,
            from: 'j.weber_2003@web.de',
            subject: 'VerbrauchsVergleich - Neues Passwort',
            html: 'Liebe(r) ' + user.name + ', <br> <br> Du hast ein neues Passwort angefordert. Dieses Passwort ist: <br> <br>' + pwd + '<br> <br> Bitte melde Dich mit diesem Passwort an und ersetze es umgehend durch ein neues, von Dir gewähltes Passwort.',
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
            success: "Passwort erfolgreich zurückgesetzt."
        }
    }
}