import type { RequestHandler } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";

const prisma = new PrismaClient();

export const POST: RequestHandler = async (event) => {
    const data = await event.request.formData();

    await prisma.user.create({
        data: {
            name: data.get("userName") as string,
            email: data.get("email") as string,
            password: data.get("password") as string
        }
    });

    return {
        status: 303,
        headers: {
            location: "/register"
        }
    }
}