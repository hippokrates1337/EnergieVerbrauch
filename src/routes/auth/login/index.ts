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
    const passwordMatch = (await bcrypt.compare(password, user.passwordHash));

    if(!user || !passwordMatch) {
        return {
            status: 400,
            body: {
                error: "Benutzername oder Passwort nicht korrekt."
            }
        };
    }

    return {
        status: 200,
        body: {
            user: {userName},
            success: "Erfolgreich eingeloggt."
        },
        headers: {
            "Set-Cookie": cookie.serialize(
                "session",
                user.userAuthToken,
                {
                    // Send cookie for every page
                    path: "/",
                    // Server-side only cookie
                    httpOnly: true,
                    // Only requests from same site can send cookies
                    sameSite: "strict",
                    // Only send over https
                    secure: process.env.NODE_ENV === "production",
                    // Set cookie to expire after a month
                    maxAge: 60 * 60 * 24 * 30
                }
            ) 
        }
    };
}
