import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();
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

    try {
        await prisma.user.create({
            data: {
                name: userName,
                email: email,
                passwordHash: await bcrypt.hash(password, saltRounds)   
            }
        });

        return {
            status: 200,
            body: {
                success: "Erfolgreich registriert."
            }
        };

    } catch(error) {
        return {
            status: 400,
            body: {
                error: "Benutzername oder E-Mail-Adresse bereits in der Datenbank vorhanden."
            }
        };
    }
}