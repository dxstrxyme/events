import z from "zod";

const startedAt = z
    .string()
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: 'startsAt должен быть валидной ISO датой'
    })
    .transform((value) => new Date(value))

export const createEventSchema = z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1),
    capacity: z.number().int().positive(),
    address: z.string().trim().min(1).max(255),
    startedAt: startedAt
})