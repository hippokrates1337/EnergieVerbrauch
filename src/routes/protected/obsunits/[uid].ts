import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";

const db = new PrismaClient();

export const PATCH: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.json();

    let updatedUnit;
    try {
        updatedUnit = await db.observationUnit.update({
            where: {
                uid: event.params.uid
            },
            data: {
                name: data.newName
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