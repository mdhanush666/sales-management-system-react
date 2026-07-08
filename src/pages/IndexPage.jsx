import BlurText from "@/components/BlurText";
import LightRays from "@/components/LightRays";
import TextType from "@/components/TextType";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function IndexPage() {
    const navigate = useNavigate();

    function handleClick() {
        navigate("/auth/login");
    }

    return (
        <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
            {/* LightRays background */}
            <div className="absolute inset-0 z-0">
                <LightRays
                    raysOrigin="bottom-center"
                    raysColor="#00ffff"
                    raysSpeed={1.5}
                    lightSpread={0.8}
                    rayLength={1.2}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0.1}
                    distortion={0.05}
                    className="custom-rays"
                />
            </div>

            {/* Centered content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <BlurText
                    text="Sales Management System"
                    delay={1000}
                    animateBy="words"
                    direction="top"
                    // onAnimationComplete={handleAnimationComplete}
                    className="text-white text-5xl mb-4 font font-bold justify-center"
                />
                <TextType
                    text={["A New Connection", "Leads To Collection"]}
                    typingSpeed={100}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                    className="text-white text-2xl"
                />
                <Button
                    onClick={handleClick}
                    className="my-8 text-white bg-transparent border border-white/50 hover:bg-transparent hover:scale-110 transition-transform duration-300 cursor-pointer"
                >
                    Let's Dive In..
                </Button>
            </div>
        </div>
    );
}

export default IndexPage;