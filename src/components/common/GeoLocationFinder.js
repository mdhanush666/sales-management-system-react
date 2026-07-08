import CustomToast from "./toastify";

const GeoLocationFinder = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {                   
                    // Success callback
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (e) => {
                    // Error callback
                    let result = {
                        error: "",
                        message: ""
                    };
                    switch (e.code) {
                        case e.PERMISSION_DENIED: // Use e.PERMISSION_DENIED instead of error.PERMISSION_DENIED
                            result.error = "PERMISSION_DENIED";
                            result.message = "User denied the request for Geolocation";
                            break;
                        case e.POSITION_UNAVAILABLE: // Use e.POSITION_UNAVAILABLE
                            result.error = "POSITION_UNAVAILABLE";
                            result.message = "Location information is unavailable";
                            break;
                        case e.TIMEOUT: // Use e.TIMEOUT
                            result.error = "TIMEOUT";
                            result.message = "The request to get user location timed out";
                            break;
                        case e.UNKNOWN_ERROR: // Use e.UNKNOWN_ERROR
                            result.error = "UNKNOWN_ERROR";
                            result.message = "An unknown error occurred";
                            break;
                        default:
                            result.error = "UNKNOWN_ERROR";
                            result.message = "An unexpected error occurred: " + e.message;
                    }
                    CustomToast.InfoToast(`${result.error}\n${result.message}`);
                    // resolve({});
                    resolve(result); // Reject the promise with the error object
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            reject({
                error: "UNSUPPORTED_BROWSER",
                message: "Geolocation is not supported by this browser."
            });
        }
    });
};

export default GeoLocationFinder;