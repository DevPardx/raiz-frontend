import { z } from "zod";

export const propertySchema = z.object({
    data: z.array(z.object({
        address: z.string(),
        areaSqm: z.string(),
        bathrooms: z.number(),
        bedrooms: z.number(),
        createdAt: z.string(),
        department: z.string(),
        description: z.string(),
        id: z.uuid(),
        images: z.array(z.object({
            displayOrder: z.number(),
            id: z.uuid(),
            url: z.url()
        })),
        latitude: z.string(),
        longitude: z.string(),
        municipality: z.string(),
        price: z.string(),
        propertyType: z.enum([ "house", "apartment", "land", "commercial", "warehouse" ]),
        status: z.enum([ "active", "paused", "sold" ]),
        title: z.string(),
        updatedAt: z.string(),
        user: z.object({
            email: z.email(),
            id: z.uuid(),
            name: z.string(),
            profilePicture: z.url().nullable()
        }),
        viewsCount: z.number()
    })),
    pagination: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
        hasNextPage: z.boolean(),
        hasPreviousPage: z.boolean()
    })
});