import Spline from '@splinetool/react-spline/next';

export default function Home() {
  return (
    <main>
      <Spline
        scene="https://prod.spline.design/KsAYMi9P1EDwvOyz/scene.splinecode" 
      />
      <div className='absolute top-0 flex justify-center flex-col left-130 mt-8 items-center'>
      <h1 className='text-5xl font-bold font-serif'>Build Your Profile</h1>
      <p className='text-lg my-2 text-gray-500'>Let's get to know you better

</p></div>
    </main>
  );
}
