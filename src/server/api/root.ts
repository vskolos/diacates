import { createTRPCRouter } from '@/server/api/trpc'
import { dataRouter } from '@/server/api/routers/data'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  data: dataRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
