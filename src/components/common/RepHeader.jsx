import React from 'react';
import logo from '../../assets/D-sms-logo-letter.png';
import PillNav from '../PillNav';
import { useSelector } from 'react-redux';

const RepHeader = () => {

    const selectedCustomerID = useSelector(state => state.userInfo.selectedCustomerID);

    return (
        <header className="w-full flex justify-end p-4">
            <PillNav
                logo={logo}
                logoAlt="Company Logo"
                items={selectedCustomerID !== null ? [
                    { label: 'About', href: '/about-us' },
                    { label: 'Contact', href: '/contact' },
                    { label: 'Customer Selected', href: '' }
                ] : [
                    { label: 'About', href: '/about-us' },
                    { label: 'Contact', href: '/contact' },
                ]}
                activeHref="/"
                className="custom-nav"
                ease="power2.easeOut"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
            />
        </header>
    );
};

export default RepHeader;