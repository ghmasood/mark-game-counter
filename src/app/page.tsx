import GameCounter from '@/components/GameCounter';

export default function Home() {
  return (
    <div
      style={{
        backgroundImage: 'url(/dez-bridge.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className='backdrop-blur-md p-4 bg-black/50'>
        <h1 className='text-3xl drop-shadow-md font-extrabold text-center mb-5'>
          شمارنده بازی مارک
        </h1>
        <div className='container mx-auto px-4'>
          <GameCounter />
        </div>
        <p className='drop-shadow-md text-white my-5 text-center text-xs'>
          ساخته شده با عشق توسط مسعود برای بروبچون دسفیل
        </p>
      </div>
    </div>
  );
}
