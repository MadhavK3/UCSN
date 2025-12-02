import React from 'react';

interface WindyMapProps {
    lat: number;
    lon: number;
    className?: string;
}

const WindyMap: React.FC<WindyMapProps> = ({ lat, lon, className }) => {
    // Construct the Windy Embed URL
    // We use the passed lat/lon for centering
    const embedUrl = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=11&overlay=wind&product=ecmwf&level=surface&lat=${lat}&lon=${lon}`;

    return (
        <div className={className}>
            <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                frameBorder="0"
                title="Windy Map"
                style={{ borderRadius: 'inherit' }} // Inherit border radius from parent
            ></iframe>
        </div>
    );
};

export default WindyMap;
