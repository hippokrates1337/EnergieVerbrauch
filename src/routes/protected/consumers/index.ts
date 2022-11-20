import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";

const db = new PrismaClient();

export const POST: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.formData();
    const consumerName = data.get("consumerName");

    if(typeof consumerName !== "string") {
        return {
            status: 400,
            body: {
                error: "Verbrauchername muss als Text angegeben werden."
            }
        }
    }
  
    let newConsumer;
    try {
        newConsumer = await db.consumer.create({
            data: {
                user: event.locals.user?.uid as string,
                name: consumerName as string
            }
        });
    } catch (error) {
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
            data: newConsumer
        }
    };
}