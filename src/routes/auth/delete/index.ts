import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import * as bcrypt from "bcrypt";
import * as cookie from "cookie";
import PrismaClient from "$lib/prisma";

const db = new PrismaClient();

export const POST: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.formData();
    const userName = data.get("userName");
    const password = data.get("password");

    if(typeof userName !== "string" || typeof password !== "string") {
        return {
            status: 400,
            body: {
                error: "Daten konnten nicht verarbeitet werden (Text erforderlich)."
            }
        };
    }

    if(!userName || !password) {
        return {
            status: 400,
            body: {
                error: "Benutzername und Passwort erforderlich."
            }
        };
    }

    const user = await db.user.findUnique({
        where: {
            name: userName
        }
    }) as User;
    if(!user) {
        return {
            status: 400,
            body: {
                error: "Benutzername nicht gefunden."
            }
        };
    }

    const passwordMatch = (await bcrypt.compare(password, user.passwordHash));
    if(!passwordMatch) {
        return {
            status: 400,
            body: {
                error: "Passwort nicht korrekt."
            }
        };
    }

    // Delete the account and all associated data
    try {
        db.consumer.deleteMany({
            where: {
                user: user.uid
            }
        });

        db.reading.deleteMany({
            where: {
                user: user.uid
            }
        });

        db.user.deleteMany({
            where: {
                uid: user.uid
            }
        });
    } catch(error) {
        return {
            status: 500,
            body: {
                error: "Konnte Benutzerkonto und hinterlegte Daten nicht aus der Datenbank entfernen."
            }
        }
    }

    // Return the user logged out to the start page
    return {
        status: 303,
        headers: {
            "Set-Cookie": cookie.serialize("session", "", {
                path: "/",
                // Set the earliest possible date (0 in system time) to have cookie expire immediately
                expires: new Date(0)
            }),
            location: "/"
        }
    };  
}
