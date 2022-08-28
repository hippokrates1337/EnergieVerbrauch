import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";

const db = new PrismaClient();

export const GET: RequestHandler = async (event: RequestEvent) => {
    const data = await db.observation.findMany({
        where: {
            user: event.locals.user?.uid
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
    const obsUnit = data.get("obsunit");
    const date = new Date(data.get("obsdate") as string);
    const obsType = data.get("obstype");
    const obsValue = parseFloat(data.get("obsvalue") as string);

    const newObs = await db.observation.create({
        data: {
            user: event.locals.user?.uid as string,
            obsUnit: obsUnit as string,
            date: date as Date,
            type: obsType as string,
            value: obsValue as number,
            unit: obsType == "electricity" ? "kWh" : "m3"
        }
    });

    if(!newObs) {
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
            data: newObs
        }
    };
}