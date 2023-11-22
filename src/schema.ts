import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const faqs = sqliteTable('faqs', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	question: text('question').notNull(),
	answer: text('answer').notNull(),
	order: integer('order', { mode: 'number' }).notNull(),
	language: text('language').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
})
export const insertFaqSchema = createInsertSchema(faqs)
export const selectFaqSchema = createSelectSchema(faqs)

export const testimonials = sqliteTable('testimonials', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	quote: text('quote').notNull(),
	name: text('name').notNull(),
	avatar: text('avatar').notNull(),
	language: text('language').notNull(),
	order: integer('order', { mode: 'number' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
})
export const insertTestimonialSchema = createInsertSchema(testimonials)
export const selectTestimonialSchema = createSelectSchema(testimonials)

