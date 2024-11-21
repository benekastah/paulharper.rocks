import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { IoMenuSharp } from "react-icons/io5";
import Dropdown from "./components/Dropdown";

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
  const navLinks = <nav>
    <ul className="list-none">
      <li className="mr-3"><Link href="/">Home</Link></li>
      <li className="mr-3"><Link href="/about">About</Link></li>
      <li className="mr-3"><Link href="/metronome">Metronome</Link></li>
      <li className="mr-3"><Link href="/note-trainer">Note trainer</Link></li>
      <li className="mr-3"><Link href="/practice">Practice</Link></li>
    </ul>
  </nav>;

  return (
    <html lang="en">
      <body className={inter.className}>
        <header id="mainHeader" className="my-5 flex">
          <h1 className="flex-grow">paulharper.rocks</h1>

          <div id="navDropdown">
            <Dropdown target={<IoMenuSharp />}>
              {navLinks}
            </Dropdown>
          </div>
          <div id="navLinks">
            {navLinks}
          </div>
        </header>

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
