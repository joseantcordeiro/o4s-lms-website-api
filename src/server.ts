import 'dotenv/config'

import { zValidator } from '@hono/zod-validator'
import { createClient } from '@libsql/client'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'
//import { sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { type z } from 'zod'
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from './env'
import { insertFaqSchema, insertTestimonialSchema, faqs, selectFaqSchema, selectTestimonialSchema, testimonials } from './schema'
//import { aggregateOneToMany } from './utils'

const client = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN })
export const db = drizzle(client)

export const app = new Hono()

app.onError((err, ctx) => {
	if ('format' in err) {
		console.error(JSON.stringify((err as z.ZodError).format(), undefined, 2))
	} else {
		console.error(err)
	}
	return ctx.json({ error: 'Internal Server Error' }, 500)
})

app.use('*', logger())
app.use('*', cors())

const listFaqsResponse = selectFaqSchema.array()

app.get('/faqs', async (ctx) => {
	const { q, limit = '10', offset = '0' } = ctx.req.query()
	let allFaqs = []
	if (!q) {
		allFaqs = await db.select().from(faqs).orderBy(faqs.order).limit(Number(limit)).offset(Number(offset))
	} else {
		allFaqs = await db
			.select()
			.from(faqs)
			.where(eq(faqs.language, q.toLowerCase()))
			.orderBy(faqs.order)
			.limit(Number(limit)).offset(Number(offset))
	}
	if (allFaqs.length < 1) return ctx.json({ error: 'Faqs not found' }, 404)
	return ctx.json(listFaqsResponse.parse(allFaqs))
})

app.get('/faqs/:id', async (ctx) => {
	const faq = await db
		.select()
		.from(faqs)
		.where(eq(faqs.id, +ctx.req.param('id')))

	if (!faq) return ctx.json({ error: 'Faq not found' }, 404)

	return ctx.json(listFaqsResponse.parse(faq))
})

const insertFaqRequest = insertFaqSchema.pick({
	question: true,
	answer: true,
	order: true,
	language: true,
})

const insertFaqResponse = selectFaqSchema

app.post('/faqs', zValidator('json', insertFaqRequest), async (ctx) => {
	const data = ctx.req.valid('json')
	const faq = await db.insert(faqs).values(data).returning().get()
	return ctx.json(insertFaqResponse.parse(faq))
})

const updateFaqRequest = insertFaqRequest.partial()
const updateFaqResponse = selectFaqSchema

app.patch('/faqs/:id', zValidator('json', updateFaqRequest), async (ctx) => {
	const data = ctx.req.valid('json');
	const faq = await db
		.update(faqs)
		.set(data)
		.where(eq(faqs.id, +ctx.req.param('id')))
		.returning()
		.get();
	return ctx.json(updateFaqResponse.parse(faq));
})

const deleteFaqResponse = selectFaqSchema.pick({ id: true });

app.delete('/faqs/:id', async (ctx) => {
	const faq = await db
		.delete(faqs)
		.where(eq(faqs.id, +ctx.req.param('id')))
		.returning({ id: faqs.id })
		.get();
	return ctx.json(deleteFaqResponse.parse(faq));
})

const listTestimonialsResponse = selectTestimonialSchema.array();

app.get('/testimonials', async (ctx) => {
	const { q, limit = '10', offset = '0' } = ctx.req.query()
	let allTestimonials = []
	if (!q) {
		allTestimonials = await db.select().from(testimonials).orderBy(testimonials.order).limit(Number(limit)).offset(Number(offset))
	} else {
		allTestimonials = await db
			.select()
			.from(testimonials)
			.where(eq(testimonials.language, q.toLowerCase()))
			.orderBy(testimonials.order)
			.limit(Number(limit)).offset(Number(offset))
	}
	if (allTestimonials.length < 1) return ctx.json({ error: 'Testimonials not found' }, 404)
	return ctx.json(listTestimonialsResponse.parse(allTestimonials))
})

app.get('/testimonials/:id', async (ctx) => {
	const testimonial = await db
		.select()
		.from(testimonials)
		.where(eq(testimonials.id, +ctx.req.param('id')))

	if (!testimonial) return ctx.json({ error: 'Faq not found' }, 404)

	return ctx.json(listTestimonialsResponse.parse(testimonial))
})

const insertTestimonialRequest = insertTestimonialSchema.pick({
	title: true,
	quote: true,
	name: true,
	avatar: true,
	order: true,
	language: true,
})

const insertTestimonialResponse = selectTestimonialSchema

app.post('/testimonials', zValidator('json', insertTestimonialRequest), async (ctx) => {
	const data = ctx.req.valid('json')
	const testimonial = await db.insert(testimonials).values(data).returning().get()
	return ctx.json(insertTestimonialResponse.parse(testimonial))
})

const updateTestimonialRequest = insertTestimonialRequest.partial()
const updateTestimonialResponse = selectTestimonialSchema

app.patch('/testimonials/:id', zValidator('json', updateTestimonialRequest), async (ctx) => {
	const data = ctx.req.valid('json')
	const testimonial = await db
		.update(testimonials)
		.set(data)
		.where(eq(testimonials.id, +ctx.req.param('id')))
		.returning()
		.get()
	return ctx.json(updateTestimonialResponse.parse(testimonial))
})

const deleteTestimonialResponse = selectTestimonialSchema.pick({ id: true })

app.delete('/testimonials/:id', async (ctx) => {
	const testimonial = await db
		.delete(testimonials)
		.where(eq(testimonials.id, +ctx.req.param('id')))
		.returning({ id: faqs.id })
		.get()
	return ctx.json(deleteTestimonialResponse.parse(testimonial))
})