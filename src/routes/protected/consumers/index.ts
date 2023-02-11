import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";

const db = new PrismaClient();

export const POST: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.formData();
    const consumerName = data.get("consumerName");
    const consumerType = data.get("consumerType");
    const consumerArea = parseFloat(data.get("consumerArea") as string);
    const consumerAdults = parseInt(data.get("consumerAdults") as string);
    const consumerChildren = parseInt(data.get("consumerChildren") as string);

    if(typeof consumerName !== "string" || typeof consumerType !== "string") {
        console.log(consumerType);
        return {
            status: 400,
            body: {
                error: "Verbrauchername und -typ müssen als Text angegeben werden."
            }
        }
    }

    if(typeof consumerArea !== "number" || typeof consumerAdults !== "number" || typeof consumerChildren !== "number") {
        return {
            status: 400,
            body: {
                error: "Fläche, Anzahl Erwachsener und Anzahl Kinder müssen als Zahl angegeben werden."
            }
        }
    }
  
    let newConsumer;
    try {
        newConsumer = await db.consumer.create({
            data: {
                user: event.locals.user?.uid as string,
                name: consumerName as string,
                type: consumerType as string,
                area: consumerArea as number,
                adults: consumerAdults as number,
                children: consumerChildren as number
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