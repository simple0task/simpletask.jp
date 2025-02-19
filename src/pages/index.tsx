// pages/index.tsx
import type { NextPage } from 'next';
import Blocks from '../components/Blocks';
import '../styles/globals.css'

const Home: NextPage = () => {
  return (
    <>
      <Blocks />
      <div className="absolute bottom-[30%] mx-2.5">
        <h1>Simple Task</h1>
        <p>複雑な作業をシステム構築や見直しでより単純な作業にして楽して生産効率を維持できるようにサポートします。</p>
        <p>フルスタック開発、ネットワーク構築。最近はTypscript,Nuxtで構築してます。</p>
        <p>simple0task@gmail.comに連絡ください</p>
        <h2>作ったもの</h2>
        <a target="_blank" href="https://miikke.jp">https://miikke.jp</a>
      </div>
    </>
  );
};

export default Home;
