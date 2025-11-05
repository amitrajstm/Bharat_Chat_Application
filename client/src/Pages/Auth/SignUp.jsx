import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../Home/components/Navbar';
import { useDarkMode } from '../../Contexts/DarkModeWrapper';
import Loader from '../../common/Loader';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInp from './components/PasswordInp';
import sign from './sign.png'
import Cookies from 'universal-cookie';
import { serverUrl } from '../../constants/apiurls';
import { useRecoilState } from 'recoil';
import { userData } from '../../atoms/state';
const cookies = new Cookies(null, { path: '/' });

const SignUp = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [currentUserData, setUserData] = useRecoilState(userData);

    const { mode } = useDarkMode();
    const [data, setData] = useState({
        email: '',
        password: "",
        fullName: '',

    });

    // Route protection if log In is true
    useEffect(() => {
        const token = cookies.get('authToken')
        if (token || currentUserData) {
            navigate('/')
        }
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/user/register`, {
                ...data
            });


            toast.success(res?.data?.message || 'Success');
            cookies.set('authToken', res?.data?.token);
            setUserData(
                res?.data?.user
            )
            navigate('/dashboard')

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
            console.log(error)
        } finally {
            setLoading(false)

        }
    }

    const handleGoogleLoginFailure = async (error) => {
        toast.error('Something went wrong please try again')
        console.log(error)
    }
    const handleGoogleLoginSuccess = async (response) => {
        console.log(response)
        if (!response.credential)
            return console.log('Login Failed');
        try {
            setLoading(true)
            const res = await axios.post(`${serverUrl}/user/gsignin`, {
                tokenId: response.credential
            })

            toast.success(res?.data?.message || 'Success')
            cookies.set('authToken', res?.data?.token);
            setUserData(
                res?.data?.user
            )
            navigate('/dashboard')

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
            console.log(error)
        } finally {
            setLoading(false)

        }
    }


    return (
        <div className=''>
            <div className='fixed z-50 top-0 w-full bg-white dark:bg-stone-900'>
                <Navbar />
            </div>


            <div className='p-4 bg-white dark:bg-stone-900   flex-1 w-full flex justify-center items-center'>

                <div className='py-12 md:px-5 p-3 bg-white dark:bg-stone-900  dark:text-gray-100 rounded-2xl mt-20 max-sm:mt-16 max-w-[500px] h-fit flex-1   shadow-sm'
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 2px 10px' }}
                >
                    <h1 className='text-center text-2xl font-bold text-gray-800 dark:text-gray-100 my-4'>Sign Up</h1>

                    <form className="w-full " onSubmit={(e) => handleSubmit(e)}>
                        <input className='w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50 dark:bg-stone-800 dark:text-gray-50 '
                            type="text" onChange={handleChange} name="fullName" placeholder='Full Name' required />
                        <br />
                        <input className='w-full my-2 p-2 px-3  outline-none rounded-md bg-gray-50 dark:bg-stone-800 dark:text-gray-50 '
                            type="email" onChange={handleChange} name="email" placeholder='Email' required />



                        <PasswordInp onChange={handleChange} placeholder={'Password'} name={'password'} />


                        <button type='submit' disabled={loading} className='bg-blue-600 rounded-full inline-flex justify-center  mx-auto w-full mt-3 max-w-[500px] hover:bg-blue-400 text-white p-1 py-2 px-3'>
                            {loading ? <Loader /> : "Sign Up"}
                        </button>

                        <div className='text-center my-4 gap-1 flex items-center justify-center text-xs dark:text-gray-100'>Already Having an Account? <Link to='/login' className='text-blue-900  font-semibold'>Login here</Link></div>
                    </form>

                    <div className='text-center my-4 gap-4 flex items-center '>
                        <div className='h-[1px] flex-1 dark:bg-stone-800 bg-stone-300 '></div>

                        or
                        <div className='h-[1px] flex-1 dark:bg-stone-800 bg-stone-300 '></div>
                    </div>


                    <GoogleOAuthProvider clientId="702829994495-1vhv30rsk04lssok9o2lmqi5d1cd7cha.apps.googleusercontent.com">
                    <div className='md:w-[450px] max-sm:w-[260px] border-none  rounded-full mx-auto'>
                    <div className='mt-4  rounded-full dark:bg-stone-800'>
                                <GoogleLogin
                                    theme={`${mode ? 'filled_black' : 'filled_white'}`}

                                    onSuccess={handleGoogleLoginSuccess}
                                    onError={handleGoogleLoginFailure}
                                />
                            </div>
                        </div>
                    </GoogleOAuthProvider>


                </div>
            </div>

        </div>
        // </div>

    );
}

export default SignUp;
