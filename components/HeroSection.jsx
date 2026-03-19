import React from 'react'
import Spline from '@splinetool/react-spline';

const HeroSection = () => {
  return (
    <div id='home' className='relative w-full h-screen '>
      <Spline className='absolute top-0 left-0 w-full h-full' 
        scene="https://prod.spline.design/viMesazhn5JqJEt8/scene.splinecode" 
      />
      <div className="absolute flex items-center mt-50 font-serif justify-center ml-110 z-10 flex-col">
        <span>
        <h1 className="text-white text-6xl font-bold">
          Your Career Mentor
        </h1>
        <br />
        <h1 className='text-sky-500 text-linear-to-r from-orange-600 text-6xl font-bold ml-30'> for Success</h1>
        <h3 className='text-gray-300 mt-15 text-lg'>Analyze your resume, identify skill gaps, generate personalized career roadmaps, <br /> practice AI mock interviews, and land your dream job with intelligent guidance.</h3>
        </span>
        <div className='grid grid-cols-2 gap-10 mt-7 text-white'>
        <button className='from-purple-700 to-blue-600 bg-linear-to-l rounded-xl'>Analyze Resume</button>
        <button className='border border-white rounded-xl p-2'>Get Career Roadmap</button>
        </div>
      </div>
      
    </div>
  )
}

export default HeroSection
