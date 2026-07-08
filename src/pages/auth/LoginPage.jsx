import CustomToast from '@/components/common/toastify';
import LiquidEther from '@/components/LiquidEther'
import StarBorder from '@/components/StarBorder'
import usePreventBack from '@/hooks/usePreventBack';
import ApiMaster from '@/utils/ApiMaster';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoggedUserID } from '@/store/slice/userSlice';
import GeoLocationFinder from '@/components/common/GeoLocationFinder';

const LoginPage = () => {

    const dispatch = useDispatch();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    const navigate = useNavigate();

    usePreventBack(!isNavigating);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let userGeoLocation = null;

        try {
            setIsLoading(true);
            userGeoLocation = await GeoLocationFinder();

            if (!userGeoLocation.error) {

                const response = await ApiMaster.post("/auth/login", { userName, password, geoLocation: userGeoLocation });

                // Inside your login form handler:
                if (response && response.success) {
                    setIsNavigating(true);
                    CustomToast.SuccessToast(response.message);

                    // Pass an object containing both parameters now
                    dispatch(setLoggedUserID({
                        userID: response.data.userID,
                        role: response.data.role
                    }));

                    if (response.data.role === 'admin') {
                        navigate("/admin/home");
                    } else {
                        navigate("/rep/home");
                    }
                } else if (response.statusCode === 429) {
                    CustomToast.WarningToast(response.message);
                } else if (!response.success) {
                    CustomToast.ErrorToast(response.message);
                }
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className='fixed inset-0 overscroll-none h-screen w-full overflow-hidden bg-black'>

            {/* Liquid Ether Background */}
            <div className="absolute inset-0 z-0">
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous={false}
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo={true}
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>

            {/* Login Form */}
            <div className="relative flex z-10 items-center justify-center h-full text-white">
                <form
                    action=""
                    onSubmit={handleSubmit}
                    className='border border-white/10 rounded-xl backdrop-blur-md shadow-xl p-8 w-full max-w-sm space-y-6'
                >
                    <h1 className='text-4xl text-center font-semibold'>Login</h1>
                    <div>
                        <label htmlFor="username" className='block text-sm font-medium'>Username</label>
                        <input
                            type='text'
                            id='username'
                            value={userName}
                            placeholder='Enter Username..'
                            required
                            autoComplete='off'
                            className='mt-1 block w-full px-4 py-2 bg-black placeholder-white border border-white/30 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400'
                            onChange={e => setUserName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className='block text-sm font-medium'>Password</label>
                        <input
                            type='password'
                            id='password'
                            placeholder='Enter Password..'
                            value={password}
                            required
                            className='mt-1 block w-full px-4 py-2 bg-black placeholder:text-white border border-white/30 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400'
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <StarBorder
                        as="button"
                        className="custom-class w-full hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
                        color="magenta"
                        speed="10s"
                        thickness={4}
                    >
                        {isLoading ? "..." : "Login"}
                    </StarBorder>
                </form>
            </div>

        </div>
    )
}

export default LoginPage
