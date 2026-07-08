import React from 'react';
import { Truck, Users, Globe, TrendingUp, Handshake, Shield } from 'lucide-react';
import RepHeader from '@/components/common/RepHeader';
import usePreventBack from '@/hooks/usePreventBack';

const COMPANY_INFO = {
    name: "MD Dynamics",
    tagline: "Empowering Sales, Driving Growth.",
    mission: "To be the leading partner for our customers by providing innovative products and unparalleled service, empowering our sales representatives to achieve extraordinary success.",
    vision: "To create a future where every sales representative is equipped with intelligent tools and data-driven insights to become a trusted advisor, doubling our market share and setting the industry standard for customer satisfaction within five years.",
    history: "Founded in 2010 by a team of industry veterans, AeroSales Dynamics quickly established itself as a market leader through a commitment to quality and a sales-first approach. We've grown from a regional distributor into a global force, all thanks to the dedication of reps like you.",
};

const AboutUs = () => {
    usePreventBack();
    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <header className="bg-black text-white pt-20 pb-16 lg:pt-32 lg:pb-24 shadow-2xl">
                <RepHeader />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
                        About <span className="text-gray-400">{COMPANY_INFO.name}</span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
                        {COMPANY_INFO.tagline}
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

                {/* Mission & Vision Section - Now side-by-side */}
                <section className="grid md:grid-cols-2 gap-12">
                    <div className="p-6 bg-white rounded-xl shadow-lg">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 border-l-4 border-gray-500 pl-3">Our Mission</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {COMPANY_INFO.mission}
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-lg">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 border-l-4 border-gray-500 pl-3">Our Vision</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {COMPANY_INFO.vision}
                        </p>
                    </div>
                </section>
                
                <section className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Our Journey</h2>
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                        <p className="text-lg text-gray-700 leading-relaxed text-center">
                            {COMPANY_INFO.history}
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer or Call to Action */}
            <footer className="bg-black text-white p-8 mt-12">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm">&copy; 2025 {COMPANY_INFO.name}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default AboutUs;