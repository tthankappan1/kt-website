import { z } from 'zod'

// Server-side validation for the two write endpoints (README §7).
// The honeypot field is named `website` — humans never see it; any value rejects.

export const LeadSchema = z.object({
  intent: z.enum(['selling', 'buying', 'both', 'curious']),
  timeframe: z.string().trim().max(40).nullish(),
  firstName: z.string().trim().min(1).max(80),
  // lastName/phone have no §7 columns (design/schema conflict, documented in
  // CLAUDE.md): the route appends them to `message` rather than dropping them.
  lastName: z.string().trim().max(80).optional().default(''),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().default(''),
  message: z.string().trim().max(4000).optional().default(''),
  newsletterAlameda: z.boolean().optional().default(false),
  newsletterContracosta: z.boolean().optional().default(false),
  sourcePage: z.string().trim().max(200).optional().default(''),
  website: z.string().max(0).optional().default(''),
})

export type LeadInput = z.infer<typeof LeadSchema>

export const NewsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  sourcePage: z.string().trim().max(200).optional().default(''),
  website: z.string().max(0).optional().default(''),
})

export type NewsletterInput = z.infer<typeof NewsletterSchema>
