import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";

const db = new PrismaClient();

export const GET: RequestHandler = async (event: RequestEvent) => {
    const data = await db.observationUnit.findMany({
        where: {
            user: event.locals.user?.uid
        }
    });

    if(!data) {
        return {
            status: 500,
            body: {
                error: "Konnte Verbraucher nicht aus der Datenbank laden."
            }
        };
    }

    return {
        status: 200,
        body: {
            data: data
        }
    };
}

export const POST: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.formData();
    const unitName = data.get("unitName");

    if(typeof unitName !== "string") {
        return {
            status: 400,
            body: {
                error: "Verbrauchername muss als Text angegeben werden."
            }
        }
    }
  
    const newUnit = await db.observationUnit.create({
        data: {
            user: event.locals.user?.uid as string,
            name: unitName as string
        }
    });

    if(!newUnit) {
        return {
            status: 500,
            body: {
                error: "Neuer Verbraucher konnte nicht in der Datenbank angelegt werden."
            } 
        }
    }

    return {
        status: 200,
        body: {
            success: "Verbraucher erfolgreich angelegt.",
            data: newUnit
        }
    };
}