import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "paulharper.rocks",
  description: "paulharper.rocks is a website about Paul Harper, who rocks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="my-5">
          <h1>paulharper.rocks</h1>

          <nav>
            <ul className="list-none flex flex-row flex-auto">
              <li className="mx-1.5"><Link href="/">Home</Link></li>
              <li className="mx-1.5"><Link href="/about">About</Link></li>
              <li className="mx-1.5"><Link href="/metronome">Metronome</Link></li>
              <li className="mx-1.5"><Link href="/note-trainer">Note trainer</Link></li>
              <li className="mx-1.5"><Link href="/practice">Practice</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
