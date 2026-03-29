import type { APIRoute } from "astro";

const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/token";
const TWITCH_STREAMS_URL = "https://api.twitch.tv/helix/streams";
const USER_LOGIN = "shallowclone";

const getTwitchToken = async (clientId: string, clientSecret: string) => {
  const authResponse = await fetch(TWITCH_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!authResponse.ok) {
    throw new Error(`Twitch token request failed with ${authResponse.status}`);
  }

  const authJson = (await authResponse.json()) as { access_token?: string };

  if (!authJson.access_token) {
    throw new Error("Twitch token response missing access_token");
  }

  return authJson.access_token;
};

export const GET = (async () => {
  const clientId = import.meta.env.TWITCH_CLIENT_ID;
  const clientSecret = import.meta.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      JSON.stringify({
        error: "Missing TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  try {
    const token = await getTwitchToken(clientId, clientSecret);
    const streamResponse = await fetch(
      `${TWITCH_STREAMS_URL}?user_login=${USER_LOGIN}`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!streamResponse.ok) {
      throw new Error(
        `Twitch stream request failed with ${streamResponse.status}`,
      );
    }

    const streamJson = (await streamResponse.json()) as {
      data?: Array<{
        id: string;
        title: string;
        viewer_count: number;
        started_at: string;
        game_name: string;
      }>;
    };

    const stream = streamJson.data?.[0];

    return new Response(
      JSON.stringify({
        username: USER_LOGIN,
        live: Boolean(stream),
        stream: stream
          ? {
              id: stream.id,
              title: stream.title,
              viewerCount: stream.viewer_count,
              startedAt: stream.started_at,
              gameName: stream.game_name,
            }
          : null,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        username: USER_LOGIN,
        live: false,
        error: message,
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}) satisfies APIRoute;
