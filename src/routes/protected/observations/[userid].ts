import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";

const db = new PrismaClient();

export const DELETE: RequestHandler = async (event: RequestEvent) => {
    let uid = event.url.searchParams.has("uid") ? event.url.searchParams.get("uid") : "";
    console.log("Received DELETE request for user ID " + event.params.userid + " and observation ID " + uid);

    try {
        await db.observation.delete({
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
    const obsUnit = data.get("obsunit");
    const startDate = new Date(data.get("startdate") as string);
    const endDate = new Date(data.get("enddate") as string);
    const obsType = data.get("obstype");
    const obsValue = parseFloat(data.get("obsvalue") as string);
    
    if(!obsUnit || typeof obsUnit !== "string") {
        return {
            status: 400,
            body: {
                error: "Unbekannter Verbraucher für den Verbrauchswert angegeben."
            } 
        }
    }

    if(!startDate || startDate.valueOf() > Date.now() || !endDate || endDate.valueOf() > Date.now() || startDate > endDate) {
        return {
            status: 400,
            body: {
                error: "Es muss ein korrektes Datum in der Vergangenheit angegeben werden. Das Startdatum muss vor dem Enddatum liegen."
            } 
        }
    }

    if(!obsType || typeof obsType !== "string") {
        return {
            status: 400,
            body: {
                error: "Art des Verbrauchs muss als Text angegeben werden."
            } 
        }
    }

    if(!obsValue) {
        return {
            status: 400,
            body: {
                error: "Es muss ein Verbrauchswert als Zahl angegeben werden."
            } 
        }
    }

    try {
        await db.observation.update({
            where: {
                uid: event.params.uid
            },
            data: {
                obsUnit: obsUnit,
                type: obsType,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                value: obsValue,
                unit: obsType == "electricity" ? "kWh" : "m3"
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