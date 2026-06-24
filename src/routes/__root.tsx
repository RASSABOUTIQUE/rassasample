import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LoadingScreen } from "../components/LoadingScreen";
import { CustomCursor } from "../components/CustomCursor";
import { AtelierConcierge } from "../components/AtelierConcierge";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-gold">404</h1>
        <h2 className="mt-4 font-display text-2xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for has wandered from the runway.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-gold">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-gold"
          >
            Try again
          </button>
          <a href="/" className="btn-ghost-gold">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1A1A1A" },
      { title: "Rassa Boutique — Where Elegance Becomes Identity" },
      {
        name: "description",
        content:
          "Rassa Boutique — a luxury women's fashion atelier in Kozhikode, Kerala. Sarees, bridal lehengas, ethnic wear and bespoke custom stitching.",
      },
      { name: "author", content: "Rassa Boutique" },
      { property: "og:title", content: "Rassa Boutique — Where Elegance Becomes Identity" },
      {
        property: "og:description",
        content:
          "Luxury Indian fashion atelier in Kozhikode, Kerala. Sarees, bridal lehengas and bespoke couture.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Poppins:wght@200;300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingScreen />
      <CustomCursor />
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <AtelierConcierge />
    </QueryClientProvider>
  );
}
