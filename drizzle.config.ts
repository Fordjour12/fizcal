import type { Config } from "drizzle-kit";

export default {
	schema: "./services/db/schemas.ts",
	out: "./drizzle",
	dialect: "sqlite",
	driver:"expo"
} satisfies Config;
