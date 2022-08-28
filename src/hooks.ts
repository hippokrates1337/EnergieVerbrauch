import type { GetSession, Handle } from "@sveltejs/kit";
import * as cookie from "cookie";

import PrismaClient from "$lib/prisma";

const db = new PrismaClient();

export const handle: Handle = async ({ event, resolve }) => {
    const cookieHeader = event.request.headers.get("cookie");
    const cookies = cookie.parse(cookieHeader ?? "");

    if(!cookies.session) {
        return await resolve(event);
    }

    const session = await db.user.findUnique({
        where: {
            userAuthToken: cookies.session
        }
    });

    if(session) {
        event.locals.user = {
            uid: session.uid,
            userName: session.name
        };
    }

    return await resolve(event);
}

export const getSession: GetSession = ({ locals }) => {
    if(!locals.user) {
        return {};
    }

    return {
        user: {
            uid: locals.user.uid,
            userName: locals.user.userName
        }
    };
}