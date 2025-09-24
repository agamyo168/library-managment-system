import { DefaultArgs } from '@prisma/client/runtime/library';
import { Prisma, PrismaClient } from '../generated/prisma';

export type PrismaTx = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>;
