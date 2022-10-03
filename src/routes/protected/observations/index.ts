import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";
import { execPath } from "process";
import { request } from "http";

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

    let newObs;

    try {
        newObs = await db.observation.create({
            data: {
                user: event.locals.user?.uid as string,
                obsUnit: obsUnit as string,
                startDate: startDate as Date,
                endDate: endDate as Date,
                type: obsType as string,
                value: obsValue as number,
                unit: obsType == "electricity" ? "kWh" : "m3"
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
            data: newObs
        }
    };
}

export const DELETE: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.json();

    try {
        await db.observation.delete({
            where: {
                uid: data.uid
            }
        });
    } catch(error) {
        return {
            status: 500
        }
    }

    return {
        status: 200
    }
}

export const PATCH: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.json();

    if(!data.newObsUnit || typeof data.newObsUnit !== "string") {
        return {
            status: 400,
            body: {
                error: "Unbekannter Verbraucher für den Verbrauchswert angegeben."
            } 
        }
    }

    if(!data.newStartDate || data.newStartDate.valueOf() > Date.now() || !data.newEndDate || data.newEndDate.valueOf() > Date.now() || data.newStartDate > data.newEndDate) {
        return {
            status: 400,
            body: {
                error: "Es muss ein korrektes Datum in der Vergangenheit angegeben werden. Das Startdatum muss vor dem Enddatum liegen."
            } 
        }
    }

    if(!data.newType || typeof data.newType !== "string") {
        return {
            status: 400,
            body: {
                error: "Art des Verbrauchs muss als Text angegeben werden."
            } 
        }
    }

    if(!data.newValue) {
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
                uid: data.uid
            },
            data: {
                obsUnit: data.newObsUnit,
                type: data.newType,
                startDate: new Date(data.newStartDate),
                endDate: new Date(data.newEndDate),
                value: parseFloat(data.newValue),
                unit: data.newType == "electricity" ? "kWh" : "m3"
            }
        });
    } catch(error) {
        return {
            status: 500
        }
    }

    return {
        status: 200
    }
}