export interface Coordinates {
    latitude: number;
    longitude: number;
}

export const getCurrentPosition = (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            getIpLocation().then(resolve).catch(() => reject(new Error('Geolocation is not supported by your browser')));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                async (error) => {
                    // If position is unavailable or timed out, try IP fallback
                    if (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) {
                        try {
                            const coords = await getIpLocation();
                            resolve(coords);
                            return;
                        } catch (fallbackError) {
                            console.warn('IP fallback failed:', fallbackError);
                        }
                    }

                    let errorMessage = 'An unknown error occurred.';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access was denied. Please enable location permissions in your browser settings.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information is unavailable from your device.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'The request to get user location timed out.';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                { timeout: 10000 }
            );
        }
    });
};

const getIpLocation = async (): Promise<Coordinates> => {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.latitude && data.longitude) {
            return {
                latitude: data.latitude,
                longitude: data.longitude
            };
        }
        throw new Error('Invalid IP location data');
    } catch (error) {
        throw error;
    }
};

export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
};

export const searchLocation = async (query: string): Promise<Coordinates> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon)
            };
        }
        throw new Error('Location not found');
    } catch (error) {
        console.error('Error searching location:', error);
        throw error;
    }
};
