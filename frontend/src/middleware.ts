import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const html = await response.text();

  const isProd = import.meta.env.PROD;

  if (isProd) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, s-maxage=300, stale-while-revalidate=300",
    );
  }

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
});
