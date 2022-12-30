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
    let newArea = parseFloat(data.newArea);
    let newAdults = parseInt(data.newAdults);
    let newChildren = parseInt(data.newChildren);

    if(typeof newName !== "string" || !newArea || !newAdults || !newChildren) {
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
                area: newArea,
                adults: newAdults,
                children: newChildren
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