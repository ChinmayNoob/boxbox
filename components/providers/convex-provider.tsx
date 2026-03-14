"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useMemo } from "react";

type Props = {
  children: React.ReactNode;
};

export default function ConvexClientProvider({ children }: Props) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL is missing. Add it to your environment before using Convex-backed pages.",
    );
  }

  const client = useMemo(() => {
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
