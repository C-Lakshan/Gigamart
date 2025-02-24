import React, { useCallback, useState } from 'react';
import { logOut } from '../../utils/jwt-helper';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const onLogOut = useCallback(() => {
        logOut();
        navigate("/");
        window.location.reload();
    }, [navigate]);

    return (
        <div className="flex flex-col items-center">
            <button 
                onClick={() => setShowLogoutDialog(true)} 
                className='w-[150px] items-center h-[48px] bg-black border rounded-lg mt-2 text-white hover:bg-gray-800'>
                Logout
            </button>
            
            {showLogoutDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[320px] text-center">
                        <p className="text-xl font-semibold mb-2">Confirm Logout</p>
                        <p className="text-gray-600 mb-4">Are you sure you want to log out?</p>
                        <div className="flex justify-end gap-4">
                            <button 
                                className="text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-900 hover:text-white transition" 
                                onClick={() => setShowLogoutDialog(false)}>
                                CANCEL
                            </button>
                            <button 
                                className="text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-900 hover:text-white transition" 
                                onClick={onLogOut}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
