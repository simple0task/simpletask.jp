import Image from "next/image";

export default function Home() {
  return (
    <div className="absolute bottom-16 left-12">
      <div className="flex items-center justify-center">
        <Image
          src="/side-logo.png"
          alt="icon"
          width={160}
          height={40}
          priority
        />
        </div>
        <p className="mx-4 my-2 text-sm">システムの開発してます</p>
        <p className="mx-6 text-sm">info@simpletask.jp</p>
        <p className="mx-4 my-2 text-sm">works</p>
        <a className="mx-6 text-sm" target="_blank" href="https://miikke.jp">https://miikke.jp</a>
        <br />
        <a className="mx-6 text-sm" target="_blank" href="https://quizdy.net">https://quizdy.net</a>
      </div>
  );
}
