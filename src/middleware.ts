import type { Context, Next } from 'hono'
import { O4S_API_KEY } from './env'
 
export async function middleware(
  ctx: Context,
  next: Next,
) {
  const key = ctx.req.header("x-api-key")
 
  if (!key) return ctx.json({ message: 'Unauthorized', ok: false }, 401)
 
  const valid = key === O4S_API_KEY

  if (!valid) return ctx.json({ message: 'Unauthorized', ok: false }, 401)
 
  await next()

	return
}