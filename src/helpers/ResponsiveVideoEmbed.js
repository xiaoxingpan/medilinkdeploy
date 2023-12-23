import React from 'react';

const VideoComponent = ({ url, background = "black", className = "video" }) => {
    return (
        <div
            className={className}
            style={{
                position: "relative",
                background: background,
                paddingBottom: "56.25%" /* 16:9 */,
                paddingTop: 25,
                height: 0
            }}
        >
            <iframe
                title="Embeded Video"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%"
                }}
                src={url}
                frameborder="0"
            />
        </div>
    );
};

export default VideoComponent;