import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../constants/apiurls';
import Loader from '../../common/Loader';

const VerificationPage = () => {
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState('');

    const{token}=useParams();
    console.log(useParams())
    console.log(token)
    const navigate=useNavigate();


    const handleVerification = async (token) => {
    
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/user/verifyforgotpass`, {
                token
            })
            toast.success(res?.data?.message || 'Success');
            navigate('/login');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong');
            setErrorText(error?.response?.data?.message || 'Something went wrong');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }


    useEffect(()=>
    {
        handleVerification(token)
    },[token])
    return (
        <div className='max-h-screen dark:bg-stone-900'>
            <h1 className='text-center text-2xl max-w-3xl mx-auto my-10'>Just  a moment while we verify your email</h1>
            <p className='text-center text-blue-500 text-lg my-10 '>{errorText}</p>
                <div className='flex items-center justify-center my-5'><Loader/></div>
        </div>
    );
}

export default VerificationPage;
