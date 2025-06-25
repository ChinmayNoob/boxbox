import React from 'react';

const Hero = () => {
    return (
        <div className='relative group '>
            <img
                src='/images/logos/logof1.webp'
                alt='f1 logo'
                className='h-36 object-contain blur-sm opacity-20 translate-y-10 translate-x-6
                 transition duration-500 ease-in-out group-hover:scale-130
                  delay-200 group-hover:opacity-0'
            />
            <div className='absolute inset-0 flex items-center justify-center'>
                <img
                    src='/images/logos/logof1.webp'
                    alt='f1 logo'
                    className='h-40 object-contain transition-transform duration-500 ease-in-out transform group-hover:-translate-y-2'
                />
            </div>
        </div>
    );
};

export default Hero;
