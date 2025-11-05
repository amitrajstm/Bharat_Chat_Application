import React from 'react';
import svg from  './404.svg'
import Navbar from '../Home/components/Navbar';
const NotFoundPage = () => {
    return (
        <div className='h-screen w-full'>
            <Navbar/>
            <img className='mx-auto' src={svg} alt="404" />

            <h1 className='text-center text-4xl font-bold text-blue-500'>404 Not Found</h1>
            <h3 className='text-center text-4xl mt-3 font-semibold text-stone-200'>Whoops! That page doesn’t exist.</h3>
        </div>
    );
}

export default NotFoundPage;
