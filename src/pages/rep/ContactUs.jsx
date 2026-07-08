import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import RepHeader from '@/components/common/RepHeader';
import usePreventBack from '@/hooks/usePreventBack';

const COMPANY_INFO = {
  name: "MD Dynamics",
  tagline: "Empowering Sales, Driving Growth.",
};

const CONTACT_INFO = {
  address: "No, 13/17 Milk Board Road Ragala Halgranoya",
  phone: "(+94) 75 956 1933",
  email: "m.dhanush666dhanu@gmail.com",
  supportEmail: "m.dhanush666dhanu@gmail.com",
  supportHours: "Mon - Fri: 8:00 AM - 6:00 PM"
};

const ContactDetailCard = ({ icon: Icon, title, content, link }) => (
  <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300">
    <Icon className="w-8 h-8 shrink-0 text-gray-600 mt-1" />
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
      {link ? (
        <a href={link} className="text-gray-600 hover:text-gray-950 transition-colors duration-200 break-all">
          {content}
        </a>
      ) : (
        <p className="text-gray-600 break-all">{content}</p>
      )}
    </div>
  </div>
);

const ContactUs = () => {
  usePreventBack();
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <header className="bg-black text-white pt-20 pb-16 lg:pt-32 lg:pb-24 shadow-2xl">
        <RepHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
            Contact <span className="text-gray-400">MD Dynamics</span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            We're here to support your success. Reach out to the right team below.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Contact Information Section */}
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Direct Support Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ContactDetailCard
              icon={Mail}
              title="Sales Rep Support"
              content={CONTACT_INFO.supportEmail}
              link={`mailto:${CONTACT_INFO.supportEmail}`}
            />
            <ContactDetailCard
              icon={Phone}
              title="Toll-Free Hotline"
              content={CONTACT_INFO.phone}
              link={`tel:${CONTACT_INFO.phone.replace(/[\s-()]/g, '')}`}
            />
            <ContactDetailCard
              icon={MapPin}
              title="Headquarters"
              content={CONTACT_INFO.address}
            />
          </div>
          <p className="mt-8 text-center text-lg text-gray-600">
            Operating Hours: <span className="font-semibold text-gray-800">{CONTACT_INFO.supportHours}</span>
          </p>
        </section>
      </main>

      {/* Footer (Consistent Style) */}
      <footer className="bg-black text-white p-8 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">&copy; 2025 {COMPANY_INFO.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default ContactUs;