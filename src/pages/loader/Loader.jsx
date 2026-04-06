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
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(var(--bs-body-bg-rgb), 0.75)',
                zIndex: 1000,
            }}
        >
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
