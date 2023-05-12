import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";

const db = new PrismaClient();

export const GET: RequestHandler = async (event: RequestEvent) => {
    const data = await db.consumer.findMany({
        where: {
            user: event.params.uid
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

export const PATCH: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.json();
    let newName = data.newName;
    let newType = data.newType;
    let newArea = parseFloat(data.newArea);
    let newAdults = parseInt(data.newAdults);
    let newChildren = parseInt(data.newChildren);
    let newColdWaterOnly = data.newColdWaterOnly == "true" ? true : false;

    if(typeof newName !== "string" || typeof newType !== "string" || !newArea || !newAdults || !newChildren) {
        return {
            status: 400,
            body: {
                error: "Eigenschaften des Verbrauchers müssen vollständig angegeben werden."
            } 
        };
    }

    let updatedUnit;
    try {
        updatedUnit = await db.consumer.update({
            where: {
                uid: event.params.uid
            },
            data: {
                name: newName,
                type: newType,
                area: newArea,
                adults: newAdults,
                children: newChildren,
                coldWaterOnly: newColdWaterOnly
            }
        });
    } catch(error) {
        return {
            status: 500,
            body: {
                error: "Konnte Verbrauchernamen nicht in der Datenbank ändern."
            }
        }
    }
    
    return {
        status: 200,
        body: {
            success: "Verbraucher erfolgreich umbenannt.",
            data: updatedUnit
        }
    }
}

export const DELETE: RequestHandler = async (event: RequestEvent) => {
    try {
        await db.consumer.deleteMany({
            where: {
                uid: event.params.uid
            }
        });

        await db.reading.deleteMany({
            where: {
                consumer: event.params.uid
            }
        });
    } catch(error) {
        return {
            status: 500,
            body: {
                error: "Konnte Verbraucher nicht aus der Datenbank entfernen."
            }
        };
    }
    
    return {
        status: 200,
        body: {
            success: "Verbraucher erfolgreich gelöscht."
        }
    }
}