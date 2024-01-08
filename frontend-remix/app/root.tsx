import { cssBundleHref } from "@remix-run/css-bundle";
import type { HeadersFunction, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetchers,
  useNavigation,
} from "@remix-run/react";

import { useEffect } from "react";

import NProgress from "nprogress";
import nProgressStyles from "nprogress/nprogress.css";

import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { isProd } from "./server/utils/environment.server";
import styles from "./styles.css";

NProgress.configure({ showSpinner: false });

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href: "/favicon.png",
    type: "image/png",
  },

  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: nProgressStyles },

  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const headers: HeadersFunction = () => {
  if (!isProd()) {
    return [];
  }

  const defaultCacheControl =
    "public, max-age=60, s-maxage=300, stale-while-revalidate=300";

  return {
    "Cache-Control": defaultCacheControl,
    "X-Cache-Control-Set-In": "root",
  };
};

export default function App() {
  const navigation = useNavigation();
  const fetchers = useFetchers();

  useEffect(() => {
    const fetchersIdle = fetchers.every((f) => f.state === "idle");
    if (navigation.state === "idle" && fetchersIdle) {
      NProgress.done();
    } else {
      NProgress.start();
    }
  }, [navigation.state, fetchers]);

  const metaDescription =
    "WACK Stack Remix Showcase. Built with WordPress, CDN, Kysely and Remix.";
  const metaOgImageUrl = "https://remix.wack.kodansha.tech/og-image.png";
  const metaSiteName = "WACK Stack Remix Showcase";

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metaDescription} />
        <meta name="viewport" content="width=device-width" />
        <meta property="og:site_name" content={metaSiteName} />
        <meta property="og:image" content={metaOgImageUrl} />
        <meta property="og:description" content={metaDescription} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={metaOgImageUrl} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="robots" content="max-image-preview:large" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white">
        <Navbar />
        <div className="container mx-auto max-w-7xl">
          <div
            className={navigation.state === "loading" ? "loading" : ""}
            id="page-content"
          >
            <Outlet />
          </div>
        </div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
