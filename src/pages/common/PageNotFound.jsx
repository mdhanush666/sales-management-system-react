import FuzzyText from '@/components/FuzzyText'
import React from 'react'

const PageNotFound = () => {
    return (
        <div className="fixed inset-0 bg-black w-full h-full overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
            <FuzzyText
                baseIntensity={0.1}
                hoverIntensity={0.3}
                enableHover
                className="text-white text-2xl sm:text-3xl md:text-5xl font-bold text-center pb-4"
            >
                404
            </FuzzyText>
            <FuzzyText
                baseIntensity={0.1}
                hoverIntensity={0.3}
                enableHover
                className="text-white text-2xl sm:text-3xl md:text-5xl font-bold text-center"
            >
                Page Not Found
            </FuzzyText>
        </div>
    )
}

export default PageNotFound