import Dock from '@/components/Dock';
import React from 'react';
import { GoHome } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { FaOpencart } from "react-icons/fa6";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RepView = () => {
    const navigate = useNavigate();

    const cartCount = useSelector(state => state.cartInfo.cartData.length);

    const items = [
        { icon: <GoHome size={18} />, label: 'Home', onClick: () => navigate('home') },
        { icon: <LuChartNoAxesCombined size={18} />, label: 'Sales Hub', onClick: () => navigate('sales-hub') },
        {
            icon: (
                <div className="relative flex items-center justify-center">
                    <FaOpencart size={18} />
                    {cartCount > 0 && (
                        <span className="absolute -top-4 -right-4 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                            {cartCount}
                        </span>
                    )}
                </div>
            ),
            label: 'Cart',
            onClick: () => navigate('cart')
        },
        { icon: <CiUser size={18} />, label: 'Profile', onClick: () => navigate('profile') },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
            <div className="sticky bottom-0 z-50">
                <Dock
                    items={items}
                    panelHeight={68}
                    baseItemSize={50}
                    magnification={70}
                    className="text-white"
                />
            </div>
        </div>
    );
};

export default RepView;