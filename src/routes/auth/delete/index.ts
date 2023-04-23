import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import * as bcrypt from "bcrypt";
import * as cookie from "cookie";
import PrismaClient from "$lib/prisma";

const db = new PrismaClient();

export const DELETE: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.json();
    const userName = data.userName;
    const password = data.password;

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
        await db.consumer.deleteMany({
            where: {
                user: user.uid
            }
        });

        await db.reading.deleteMany({
            where: {
                user: user.uid
            }
        });

        await db.user.deleteMany({
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

    // Log the user out
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
