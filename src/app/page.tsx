"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

function getInitialIsDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialIsDark);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const logoSrc = isDarkMode
    ? "/side-logo-dark-mode.png"
    : "/side-logo.png";

  return (
    <div className="absolute bottom-16 left-8">
      <div className="flex items-center justify-center">
        <Image
          src={logoSrc}
          alt="icon"
          width={160}
          height={40}
          priority
          unoptimized
        />
      </div>
      <p className="mx-4 my-2 text-sm">システムの開発してます</p>
      <p className="mx-6 text-sm">info@simpletask.jp</p>
      <p className="mx-4 my-2 text-sm">works</p>
      <a className="mx-6 text-sm" target="_blank" href="https://miikke.jp">
        https://miikke.jp
      </a>
      <br />
      <a className="mx-6 text-sm" target="_blank" href="https://quizdy.net">
        https://quizdy.net
      </a>
    </div>
  );
}
