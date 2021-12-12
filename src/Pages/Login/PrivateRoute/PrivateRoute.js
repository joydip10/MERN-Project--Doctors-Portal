import { CircularProgress } from '@mui/material';
import React from 'react';
import { useLocation,Navigate } from 'react-router-dom';
import useAuth from './../../../hooks/useAuth';

const PrivateRoute = ({ children,...rest }) => {
    const { user, isLoading } = useAuth();
    const location=useLocation();

    if (isLoading) { return <CircularProgress /> }
    else{
        if (user.email) {
            return children;            
        }
        else{
            return <Navigate to="/login" state={{ from: location }} />;
        }
    }
};

export default PrivateRoute;