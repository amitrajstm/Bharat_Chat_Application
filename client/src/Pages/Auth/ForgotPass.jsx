import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../Home/components/Navbar';
import { Link } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa6";
import Loader from '../../common/Loader';

const ForgotPass = () => {
    const [data, setData] = useState({
        email: '',
        newpassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const [passToggle, setPassToggle] = useState(false);

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
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user/forgotpass`, {
                ...data
            })
            toast.success(res?.data?.message || 'Success');
            setLinkSent(true)
            setData({
                email: '',
                newpassword: ""
            })
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong');
            console.log(error);
        } finally {
            setLoading(false);

        }
    }
    return (
        <div className=''>
            <div className='fixed  z-50  top-0 w-full bg-white dark:bg-stone-900'>
                <Navbar />
            </div>


            <div className='p-4 bg-white dark:bg-stone-900  mt-20   flex-1 flex justify-center items-center'>

                <div className='pt-8 pb-6 md:px-5 p-3 bg-white dark:bg-stone-900  dark:text-gray-100 rounded-2xl mt-10 max-sm:mt-16 max-w-[500px] h-fit flex-1    shadow-sm'
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 2px 10px' }}
                >
                    <h1 className='text-center text-2xl font-bold text-gray-800 dark:text-gray-100 my-4'>Forget Password</h1>
{
             !linkSent?       <form className="w-full" onSubmit={(e) => handleSubmit(e)}>

                     <input className='w-full my-2 p-2 px-3  outline-none rounded-md bg-gray-50 dark:bg-stone-800 dark:text-gray-50 '
                            type="email" onChange={handleChange} name="email" id="" placeholder='Email' required />
                        <br />
                    
                            <div className='relative'>
                                <input className='w-full  mb-4 p-2 px-3 outline-none rounded-md bg-gray-50 dark:bg-stone-800 dark:text-gray-50 '
                                    type={passToggle ? "password" : "text"} onChange={handleChange} name="newpassword" id="" placeholder='New Password' required />
                                <br />
                                {
                                    passToggle ? <FaEyeSlash  onClick={() => setPassToggle(!passToggle)} className='absolute text-xl text-stone-800 dark:text-stone-400 right-3 top-3 cursor-pointer' />
                                        : <FaEye onClick={() => setPassToggle(!passToggle)} className='absolute text-xl text-stone-800 dark:text-stone-400 right-3 top-3 cursor-pointer' />
                                }
                            </div>
                        
                        <button type='submit' disabled={loading} className='bg-blue-600 rounded-full inline-flex justify-center  mx-auto w-full mt-3 max-w-[500px] hover:bg-blue-400 text-white p-1 py-2 px-3'>
                            {loading ? <Loader /> : "Reset Password"}
                        </button>

                        <p className='text-center mt-8 gap-1 flex items-center justify-center text-xs dark:text-gray-100'>Not Having Account? <Link to='/signup' className='text-blue-800 font-semibold'>SignUp here</Link></p>
                    </form>

                  :  <div className=' text-center p-4 text-lg'>
                            🎉 A verification link has been sent on your Email. Please check your Email.
                            Click on the link and your password will be resetted.
                    </div>
}




                </div>
            </div>

        </div>
    );
}

export default ForgotPass;
