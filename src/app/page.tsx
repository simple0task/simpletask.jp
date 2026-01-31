"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="absolute bottom-16 left-8">
      <div className="flex items-center justify-center">
        <picture>
          {/* ダークモード時に使う画像 */}
          <source
            srcSet="/side-logo-dark-mode.png"
            media="(prefers-color-scheme: dark)"
          />
          {/* ライトモードのフォールバック */}
          <Image
            src="/side-logo.png"
            alt="icon"
            width={160}
            height={40}
            priority
            unoptimized
          />
        </picture>
      </div>

      <p className="mx-4 my-2 text-sm">システムの開発してます</p>
      <p className="mx-6 text-sm">info@simpletask.jp</p>
      <p className="mx-4 my-2 text-sm">works</p>
      <a className="mx-6 text-sm" target="_blank" rel="noreferrer" href="https://miikke.jp">
        https://miikke.jp
      </a>
      <br />
      <a className="mx-6 text-sm" target="_blank" rel="noreferrer" href="https://quizdy.net">
        https://quizdy.net
      </a>
    </div>
  );
}
