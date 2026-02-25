import { useState, useEffect } from 'react';

export interface Location {
    lat: number;
    lng: number;
    accuracy: number;
}

export const useGeolocation = (enableTracking = true) => {
    const [location, setLocation] = useState<Location | null>(null);
    const [heading, setHeading] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enableTracking || !navigator.geolocation) return;

        // 1. High-frequency tracking
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, heading: deviceHeading, accuracy } = position.coords;

                setLocation(prev => {
                    // Calculate heading manually if the device doesn't provide it
                    if (deviceHeading === null && prev) {
                        const y = Math.sin((longitude - prev.lng) * Math.PI / 180);
                        const x = Math.cos(prev.lat * Math.PI / 180) * Math.sin(latitude * Math.PI / 180);
                        const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
                        setHeading(bearing);
                    } else if (deviceHeading !== null) {
                        setHeading(deviceHeading);
                    }
                    return { lat: latitude, lng: longitude, accuracy };
                });
            },
            (err) => setError(err.message),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );

        // 2. Mobile Compass Support
        const handleOrientation = (e: DeviceOrientationEvent) => {
            // @ts-ignore - webkitCompassHeading is non-standard but works on iOS
            const compass = e.webkitCompassHeading || (e.alpha ? (360 - e.alpha) : null);
            if (compass) setHeading(compass);
        };

        window.addEventListener('deviceorientation', handleOrientation as any, true);

        return () => {
            navigator.geolocation.clearWatch(watchId);
            window.removeEventListener('deviceorientation', handleOrientation as any);
        };
    }, [enableTracking]);

    return { location, heading, error };
};
