import { parseEnv } from 'znv'
import { z } from 'zod'

export const { O4S_API_KEY, DATABASE_URL, DATABASE_AUTH_TOKEN } = parseEnv(process.env, {
	O4S_API_KEY: z.string().min(1),
	DATABASE_URL: z.string().min(1),
	DATABASE_AUTH_TOKEN: z.string().min(1).optional(),
})