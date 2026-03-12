import React from 'react';

const Loader = () => {
    return (
        <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{ minHeight: '200px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
