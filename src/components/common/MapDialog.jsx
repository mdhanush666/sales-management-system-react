import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { LatLng } from 'leaflet'; // Import LatLng from Leaflet
import L from 'leaflet'; // Import Leaflet itself to use its icon capabilities

// Fix for default marker icon not showing in Webpack environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


// Helper component to recenter the map when props change
function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}


const GeoLocationMapDialog = ({ isOpen, onClose, lat, lon }) => {
    if (!isOpen) return null; // Don't render if not open

    const initialPosition = new LatLng(lat, lon); // Use LatLng object

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000, // Ensure it's above other content
            }}
            onClick={onClose} // Close when clicking outside the dialog content
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '80%', // Adjust width as needed
                    maxWidth: '800px', // Max width for larger screens
                    height: '80%', // Adjust height as needed
                    maxHeight: '600px', // Max height
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <h2 style={{ marginBottom: '15px', textAlign: 'center', color: '#333' }}>Geo Location</h2>
                <div style={{ flexGrow: 1, minHeight: 0 }}> {/* Map container needs to grow */}
                    <MapContainer
                        center={initialPosition}
                        zoom={17}
                        scrollWheelZoom={true} // Enable scroll zoom
                        style={{ height: '100%', width: '100%', borderRadius: '4px' }}
                    >
                        <ChangeView center={initialPosition} zoom={17} /> {/* Re-center map if lat/lon changes */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            subdomains={['a', 'b', 'c']}
                        />
                        <Marker position={initialPosition} />
                    </MapContainer>
                </div>
                <div style={{ marginTop: '15px', textAlign: 'right' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeoLocationMapDialog;