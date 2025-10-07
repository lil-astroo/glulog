import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import { ToastContainer, Bounce } from 'react-toastify';
import { Share, Smartphone, SquarePlus } from 'lucide-react';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import routes from './router';

import './App.css'

export default function App() {
  const [isStandalone, setIsStandalone] = useState(false);
  const router = useRoutes(routes);
  const location = useLocation();
  const navigate = useNavigate();
  const showNavbar = location.pathname !== '/login';

  useEffect(() => {

    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );

    const loginPage = location.pathname === '/login';
    const userAuth = Cookies.get('userAuth') === 'true';

    if (!userAuth && !loginPage) {
      navigate('/login');
    }

    if (userAuth && loginPage) {
      navigate('/dashboard');
    }
  }, [location, navigate]);

  if (!isStandalone) {
    return (
      <div className='standalone-warning'>
        <img src="/logo.png" className='standalone-warning__logo' alt="" />
        <h1 className='standalone-warning__title'>وب اپلیکیشن را دانلود کنید</h1>
        <div className='standalone-warning__details'>
          <div className='standalone-warning__box'>
            <Share className='standalone-warning__icon' />
            <div className='standalone-warning__text'>
              <h2 className='standalone-warning__subtitle'>Share</h2>
              <small>گزینه share را از نوار مرورگر خود انتخاب کنید</small>
            </div>
          </div>
          <div className='standalone-warning__box'>
            <SquarePlus className='standalone-warning__icon' />
            <div className='standalone-warning__text'>
              <h2 className='standalone-warning__subtitle'>Add To Home Screen</h2>
              <small>از منو ظاهر شده این گزینه را پیدا و انتخاب کنید</small>
            </div>
          </div>
          <div className='standalone-warning__box'>
            <Smartphone className='standalone-warning__icon' />
            <div className='standalone-warning__text'>
              <h2 className='standalone-warning__subtitle'>Add</h2>
              <small>بدون تغییر هیچ گزینه دکمه Add را بزنید</small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container'>
      {router}
      {showNavbar && <Navbar />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        stacked={true}
        rtl
        theme="dark"
        transition={Bounce}
      />
    </div>
  )
}
