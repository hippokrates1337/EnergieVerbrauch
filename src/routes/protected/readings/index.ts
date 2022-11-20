import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";

const db = new PrismaClient();

export const GET: RequestHandler = async (event: RequestEvent) => {
    const data = await db.reading.findMany({
        select: {
            date: true,
            type: true,
            consumer: true,
            value: true
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

export const POST: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.formData();
    const consumer = data.get("consumer");
    const date = new Date(data.get("date") as string);
    const type = data.get("type");
    const value = parseFloat(data.get("value") as string);

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

    let newReading;

    try {
        newReading = await db.reading.create({
            data: {
                user: event.locals.user?.uid as string,
                consumer: consumer as string,
                date: date as Date,
                type: type as string,
                value: value as number
            }
        });
    } catch(error) {
        return {
            status: 500,
            body: {
                error: "Neuer Verbrauchswert konnte nicht in der Datenbank angelegt werden."
            } 
        }
    }

    return {
        status: 200,
        body: {
            success: "Verbrauchswert erfolgreich angelegt.",
            data: newReading
        }
    };
}