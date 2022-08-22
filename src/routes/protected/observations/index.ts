import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";

export const GET: RequestHandler = async (event: RequestEvent) => {
    return {
        status: 200,
        body: {}
    }
}