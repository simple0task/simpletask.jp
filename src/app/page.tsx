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

function ContactDialog({ onClose, visible }: { onClose: () => void; visible: boolean }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0,0,0,0.4)",
        transition: "opacity 0.2s ease",
        opacity: visible ? 1 : 0,
      }}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg p-6 w-80 shadow-lg"
        style={{
          transition: "transform 0.2s ease, opacity 0.2s ease",
          transform: visible ? "scale(1)" : "scale(0.8)",
          opacity: visible ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-sm font-semibold mb-4 dark:text-white">お問い合わせ</h2>
        {status === "sent" ? (
          <div className="text-sm dark:text-white">
            <p>送信しました。ありがとうございました。</p>
            <button
              className="mt-4 text-xs text-gray-500 dark:text-gray-400 underline cursor-pointer"
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-transparent dark:text-white outline-none focus:border-gray-500"
            />
            <textarea
              required
              placeholder="内容"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-transparent dark:text-white outline-none focus:border-gray-500 resize-none"
            />
            {status === "error" && (
              <p className="text-xs text-red-500">送信に失敗しました。再度お試しください。</p>
            )}
            <div className="flex justify-end gap-3 mt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={status === "sending"}
                className="text-xs bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded px-3 py-1 disabled:opacity-50 cursor-pointer"
              >
                {status === "sending" ? "送信中..." : "送信"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ImageViewer({ src, alt, onClose, visible }: { src: string; alt: string; onClose: () => void; visible: boolean }) {
  return (
    <div
      className={`image-viewer-backdrop fixed inset-0 items-center justify-center z-50${visible ? " is-visible" : ""}`}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="image-viewer-content"
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={640}
          height={480}
          unoptimized
          style={{
            display: "block",
            maxWidth: "90vw",
            maxHeight: "80vh",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [showContact, setShowContact] = useState(false);
  const [contactMounted, setContactMounted] = useState(false);
  const [showWorks, setShowWorks] = useState(false);

  const openContact = () => { setContactMounted(true); requestAnimationFrame(() => setShowContact(true)); };
  const closeContact = () => {
    setShowContact(false);
    setTimeout(() => setContactMounted(false), 200);
  };

  const openWorks = () => setShowWorks(true);
  const closeWorks = () => setShowWorks(false);

  return (
    <>
      <FallingLeaf />
      {contactMounted && <ContactDialog onClose={closeContact} visible={showContact} />}
      <ImageViewer
        src="/works/jet-stream-01.png"
        alt="注文管理システム"
        onClose={closeWorks}
        visible={showWorks}
      />
      <div className="absolute bottom-16 left-8 flex flex-col items-start justify-center">
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

        <p className="mx-4 mt-2 mb-2 text-sm">works</p>
        <a className="mx-6 mt-1 text-sm" target="_blank" rel="noreferrer" href="https://miikke.jp">
          https://miikke.jp
        </a>
        <a className="mx-6 mt-2 text-sm" target="_blank" rel="noreferrer" href="https://quizdy.net">
          https://quizdy.net
        </a>
        <span
          className="mx-6 mt-3 text-xs cursor-pointer"
          onClick={openWorks}
        >
          注文管理システム
        </span>
        <p
        className="mx-4 mt-4 text-sm cursor-pointer hover:underline"
        onClick={openContact}
      >
        contact
      </p>
      </div>
    </>
  );
}
