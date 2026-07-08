import { useEffect } from "react";

const usePreventBack = (shouldBlock = true) => {
    useEffect(() => {
        // If shouldBlock is false, break early and do not hook into history!
        if (!shouldBlock) return;

        window.history.pushState(null, document.title, window.location.href);

        const handlePopState = (event) => {
            window.history.pushState(null, document.title, window.location.href);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [shouldBlock]); // Triggers cleanly whenever shouldBlock flips
};

export default usePreventBack;