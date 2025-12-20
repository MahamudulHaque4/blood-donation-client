import React, { use, useContext } from 'react'
import { AuthContext } from '../providers/AuthContext';

const useAuth = () => {
    const authInfo = useContext(AuthContext);
    return authInfo;
};

export default useAuth;
