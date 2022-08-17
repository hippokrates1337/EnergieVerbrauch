import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const saltRounds = 10;

export const POST: RequestHandler = async (event: RequestEvent) => {
    const data = await event.request.formData();

    await bcrypt.hash(data.get("password") as string, saltRounds, async (err, hash) => {
        if(err) {
            return {
                status: 500,
                errors: {
                    password: "Unable to hash password"
                }
            };
        } else {
            await prisma.user.create({
                data: {
                    name: data.get("userName") as string,
                    email: data.get("email") as string,
                    password: hash as string
                }
            });
        }
    });

    return {
        status: 303,
        headers: {
            location: "/register"
        }
    };
}