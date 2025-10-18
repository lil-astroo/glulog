import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { CircleUser, Eye } from 'lucide-react'

import '../assets/styles/login.css'

export default function Login() {

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
        rememberMe: false
    })
    const [login, setLogin] = useState(false)

    const fetchData = async () => {
        const response = await fetch(
            "https://api.backendless.com/F709728E-F527-4D4C-B3DA-C415F4581F77/D270E61A-C6A4-4589-88B4-4AF48BF29ABB/data/usersData"
        );
        const data = await response.json();
        const username = loginData.username.toLowerCase().trim();
        const password = loginData.password.toLowerCase().trim();
        const user = data.find(
            (user) =>
                user.username === username && user.password === password
        );
        return user;
    };

    const loginHandler = async (e) => {
        e.preventDefault();

        if (loginData.username === "" || loginData.password === "") {
            toast.error("لطفا تمامی فیلدها را پر کنید!");
            return;
        }

        try {
            toast.loading("در حال ورود...");

            const user = await fetchData();

            if (user) {
                if (loginData.rememberMe) {
                    Cookies.set('userAuth', true, { expires: 30 });
                } else {
                    Cookies.set('userAuth', true, { expires: 1 });
                }

                toast.dismiss();
                toast.success("ورود با موفقیت انجام شد!");
                window.location.href = "/glulog";
            } else {
                toast.dismiss();
                toast.error("نام کاربری یا رمز عبور اشتباه است!");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("خطایی رخ داد!");
        }
    };

    const errorHandler = () => {
        toast.warning('متاسفانه امکان ثبت نام در حال حاضر وجود ندارد!');
    }

    return (
        <form className='login__form' onSubmit={loginHandler}>
            <div className='login__form__header'>
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="" />
                <h1>خوش آمدید</h1>
            </div>
            <div className='login__form__body'>
                <div className='login__form__body__input'>
                    <input
                        type="text"
                        placeholder='نام کاربری'
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    />
                    <CircleUser className='login__form__body__icon' />
                </div>
                <div className='login__form__body__input'>
                    <input
                        type="password"
                        placeholder='رمز عبور'
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                    <Eye className='login__form__body__icon' />
                </div>
                <div className='login__form__body__remember'>
                    <input
                        type="checkbox"
                        id='remember'
                        onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                    />
                    <label htmlFor="remember">مرا به خاطر بسپار</label>
                </div>
                <button className='login__form__body__btn'>ورود</button>
            </div>
            <div className='login__form__footer'>
                <p onClick={errorHandler}>ثبت نام</p>
            </div>
        </form>
    )
}
