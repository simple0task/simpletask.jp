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
        }}>simpletask</h1>
        <p>ソフトウェア開発してます</p>
        <p>連絡先：info@simpletask.jp</p>
        <h1 style={{
          fontFamily: 'M PLUS 1p',
          fontWeight: 600,
          fontSize: '1rem',
          paddingTop: '0.5rem',
        }}>works</h1>
        <a className="mx-2" target="_blank" href="https://miikke.jp">https://miikke.jp</a><br> 
        <a className="mx-2" target="_blank" href="https://quizdy.net">https://quizdy.net</a><br> 
        <a className="mx-2" href="">https://twilight.jp</a> 
      </div>
    </>
  );
};

export default Home;
