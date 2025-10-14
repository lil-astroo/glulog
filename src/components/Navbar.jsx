import { Link } from 'react-router-dom'
import { BellRing, ClipboardPlus, House, Syringe } from 'lucide-react'
import { toast } from 'react-toastify'

import '../assets/styles/navbar.css'

export default function Navbar() {

    const errorHandler = () => {
        toast.warning('این بخش در درست توسعه میباشد!')
    }

    return (
        <nav>
            <div className="nav__icon">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="" />
            </div>
            <div className="nav__body">
                <Link to='/home' className="item item--active animate__animated animate__fadeInUp">
                    <House className='item__icon' />
                </Link>
                <Link to='/records' className="item animate__animated animate__fadeInUp">
                    <ClipboardPlus className='item__icon' />
                </Link>
                <Link onClick={errorHandler} className="item animate__animated animate__fadeInUp">
                    <Syringe className='item__icon' />
                </Link>
                <Link onClick={errorHandler} className="item animate__animated animate__fadeInUp">
                    <BellRing className='item__icon' />
                </Link>
            </div>
        </nav>
    )
}
