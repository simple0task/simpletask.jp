// pages/index.tsx
import type { NextPage } from 'next';
import Blocks from '../components/Blocks';

const Home: NextPage = () => {
  return (
    <>
      <Blocks />
      <div className="absolute bottom-10 right-2">
        <h1 style={{
          fontFamily: 'M PLUS 1p',
          fontWeight: 600,
          fontSize: '1.2rem',
          paddingBottom: '1rem',
        }}>Simple Task</h1>
        <p>複雑な作業をシステム構築や見直しでより単純な作業にして楽して</p>
        <p>生産効率を維持できるようにサポートします。</p>
        <p>フルスタック開発、ネットワーク構築。最近はTypscript,Nuxtで開発することが多いです。</p>
        <p>一緒に開発しましょう。simple0task@gmail.comに連絡ください。</p>
        <h1 style={{
          fontFamily: 'M PLUS 1p',
          fontWeight: 600,
          fontSize: '1rem',
          paddingTop: '0.5rem',
        }}>works</h1>
        <a className="mx-2" target="_blank" href="https://miikke.jp">https://miikke.jp</a> | 
        <a className="mx-2" href="">https://quizdy.net</a> | 
        <a className="mx-2" href="">https://twilight.jp</a> 
      </div>
    </>
  );
};

export default Home;
