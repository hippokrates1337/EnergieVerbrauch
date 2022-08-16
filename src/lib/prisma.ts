// Use 'import PrismaClient from "$lib/prisma";' to use the Prisma client

import Prisma, * as PrismaAll from '@prisma/client';

const PrismaClient = Prisma?.PrismaClient || PrismaAll?.PrismaClient;
export default PrismaClient;
