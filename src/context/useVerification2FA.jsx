import { createContext, useContext, useState } from "react";
import TwoFactorAuthentication from '@/pages/TwoFactorAuthentication/TwoFactorAuthentication'
import { useAuthContext } from '@/context/useAuthContext';
import { useNavigate } from "react-router-dom";
const TwoFAContext = createContext();

export const TwoFAProvider = ({ children }) => {
    const navigate = useNavigate();
    const {is2FAAuthnticator} = useAuthContext();
    const [showModal, setShowModal] = useState(false);
    const [resolver, setResolver] = useState(null);

    const require2FA = () => {
        if(!is2FAAuthnticator){
            navigate('/2fa-authnticator')
            return
        }
        setShowModal(true);

        return new Promise((resolve) => {
            setResolver(() => resolve);
        });
    };

    const handleSuccess = () => {
        setShowModal(false);
        resolver(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        resolver(false);
    };

    return (
        <TwoFAContext.Provider value={{ require2FA, setShowModal }}>
            {children}
            {showModal && (
                <TwoFactorAuthentication
                    onSuccess={handleSuccess}
                    onClose={handleCancel}
                />
            )}
        </TwoFAContext.Provider>
    );
};

export const use2FA = () => useContext(TwoFAContext);