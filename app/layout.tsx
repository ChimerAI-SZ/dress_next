import Provider from "./provider";
import { Suspense } from "react";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body>
        <Suspense>
          <Provider>{children}</Provider>
        </Suspense>
      </body>
    </html>
  );
}
