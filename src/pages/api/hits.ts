import { Redis } from "@upstash/redis";
import type { APIRoute } from "astro";

const redis = Redis.fromEnv();
const COUNTER_KEY = "hits";

export const GET = (async () => {
  try {
    const count = await redis.get<number>(COUNTER_KEY);

    return new Response(
      JSON.stringify({
        hits: count ?? 0,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        hits: null,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}) satisfies APIRoute;

export const POST = (async () => {
  try {
    const count = await redis.incr(COUNTER_KEY);

    return new Response(
      JSON.stringify({
        hits: count,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        hits: null,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}) satisfies APIRoute;