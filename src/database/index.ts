import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from "../config/env.config";

const db1: PrismaClient = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
  log: ["info", "error"],
  errorFormat: "minimal",
});

export default {
  db1,
};
