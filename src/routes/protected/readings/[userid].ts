import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";

const db = new PrismaClient();

export const GET: RequestHandler = async (event: RequestEvent) => {
    const data = await db.reading.findMany({
        where: {
            user: event.params.userid
        }
    });

    if(!data) {
        return {
            status: 500,
            body: {
                error: "Konnte Verbrauchswerte nicht aus der Datenbank laden."
            }
        };
    }
    
    return {
        status: 200,
        body: {
            data: data
        }
    }
}

export const DELETE: RequestHandler = async (event: RequestEvent) => {
    let uid = event.url.searchParams.has("uid") ? event.url.searchParams.get("uid") as string : "";

    try {
        await db.reading.deleteMany({
            where: {
                user: event.params.userid,
                uid: uid
            }
        });
    } catch(error) {
        return {
            status: 500,
            body: {
                error: "Konnte Verbrauchswert nicht aus der Datenbank entfernen."
            }
        }
    }

    return {
        status: 200,
        body: {
            success: "Verbrauchswert erfolgreich gelöscht."
        }
    }
}

export const PATCH: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.formData();
    const consumer = data.get("consumer");
    const date = new Date(data.get("date") as string);
    const type = data.get("type");
    const value = parseFloat(data.get("value") as string);
    
    let uid = event.url.searchParams.has("uid") ? event.url.searchParams.get("uid") as string : "";

    if(!consumer || typeof consumer !== "string") {
        return {
            status: 400,
            body: {
                error: "Unbekannter Verbraucher für den Verbrauchswert angegeben."
            } 
        }
    }

    if(!date || date.valueOf() > Date.now()) {
        return {
            status: 400,
            body: {
                error: "Es muss ein korrektes Datum in der Vergangenheit angegeben werden."
            } 
        }
    }

    if(!type || typeof type !== "string") {
        return {
            status: 400,
            body: {
                error: "Art des Verbrauchs muss als Text angegeben werden."
            } 
        }
    }

    if(!value) {
        return {
            status: 400,
            body: {
                error: "Es muss ein Verbrauchswert als Zahl angegeben werden."
            } 
        }
    }

    try {
        await db.reading.updateMany({
            where: {
                user: event.params.userid,
                uid: uid
            },
            data: {
                consumer: consumer,
                type: type,
                date: new Date(date),
                value: value
            }
        });
    } catch(error) {
        return {
            status: 500,
            body: {
                error: "Konnte Verbrauchswert nicht in der Datenbank anpassen."
            }
        }
    }
    
    return {
        status: 200,
        body: {
            success: "Verbrauchswert erfolgreich angepasst."
        }
    }
}