"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

function FallingLeaf() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [style, setStyle] = useState({ y: -100, swayX: 0, rotation: 0, opacity: 0 });

  const animationRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const swayPhaseRef = useRef(0);
  const leafPropsRef = useRef({ left: 50, size: 40, duration: 18 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const initLeaf = () => {
      const maxSway = 120;
      const margin = (maxSway / window.innerWidth) * 100;
      leafPropsRef.current = {
        left: margin + Math.random() * (100 - margin * 2),
        size: 30 + Math.random() * 20,
        duration: 15 + Math.random() * 5,
      };
      startTimeRef.current = performance.now();
      swayPhaseRef.current = Math.random() * Math.PI * 2;
    };

    initLeaf();

    const animate = (time: number) => {
      const { duration } = leafPropsRef.current;
      const elapsed = (time - startTimeRef.current) / 1000;
      const progress = elapsed / duration;

      if (progress >= 1) {
        initLeaf();
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const y = -100 + progress * (window.innerHeight + 200);
      const rotation = progress * 360;

      // 横向き時に揺れ幅を大きく
      const horizontalness = Math.sin((rotation % 180 / 180) * Math.PI);
      const swayAmount = 50 + 70 * horizontalness;

      swayPhaseRef.current += 0.02;
      const swayX = Math.sin(swayPhaseRef.current) * swayAmount;

      // 透明度（最大0.8）
      let opacity = 0.8;
      if (progress < 0.1) opacity = progress * 8;
      else if (progress > 0.9) opacity = (1 - progress) * 8;

      setStyle({
        y,
        swayX,
        rotation,
        opacity,
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div
      className="falling-leaf"
      style={{
        left: `${leafPropsRef.current.left}%`,
        transform: `translateY(${style.y}px) translateX(${style.swayX}px)`,
        opacity: style.opacity,
      }}
    >
      <div style={{ transform: `rotate(${style.rotation}deg)` }}>
        <Image
          src={isDarkMode ? "/leaf-dark-mode.png" : "/leaf.png"}
          alt=""
          width={leafPropsRef.current.size}
          height={leafPropsRef.current.size}
          unoptimized
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <FallingLeaf />
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
    </>
  );
}
