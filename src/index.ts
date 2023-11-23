import { serve } from '@hono/node-server'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { app, db } from './server'
import { PORT } from './env'

const port = PORT || 4001

async function main() {
	await migrate(db, {
		migrationsFolder: './migrations',
	})

	serve(app).listen(port).once('listening', () => {
		console.log(`🚀 Server started on port ${PORT}`)
	})
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})