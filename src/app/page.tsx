import GameCounter from '@/components/GameCounter';

export default function Home() {
  return (
    <div
      className='min-h-screen bg-gray-900'
      style={{
        backgroundImage: 'url(/dez-bridge.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='backdrop-blur-md p-4 bg-black/50 h-screen'>
        <div className='container mx-auto px-4'>
          <h1 className='text-3xl drop-shadow-md font-extrabold text-center mb-5 '>
            شمارنده بازی مارک
          </h1>
          <GameCounter />
        </div>
        <p className='drop-shadow-md text-white my-5 text-center'>
          ساخته شده با عشق توسط مسعود برای بروبچون دسفیل
        </p>
      </div>
    </div>
  );
}
