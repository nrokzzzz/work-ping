import React, { useState, useEffect } from 'react';

const Loader = () => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleShow = () => setIsLoading(true);
        const handleHide = () => setIsLoading(false);

        window.addEventListener('SHOW_LOADER', handleShow);
        window.addEventListener('HIDE_LOADER', handleHide);

        return () => {
            window.removeEventListener('SHOW_LOADER', handleShow);
            window.removeEventListener('HIDE_LOADER', handleHide);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-body bg-opacity-75"
            style={{
                zIndex: 9999
            }}
        >
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
