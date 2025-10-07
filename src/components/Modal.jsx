import React, { useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { toast } from 'react-toastify';
import { Binary, CalendarDays, ClockIcon, Syringe } from 'lucide-react';

import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import '../assets/styles/Modal.css';

export default function Modal({ onClose, reload }) {

    const [loading, setLoading] = useState(false); // ← برای غیرفعال کردن دکمه
    const [gloucoseData, setGlucoseLevel] = useState({
        date: '',
        time: '',
        glucoseLevel: '',
        insulinUnits: ''
    });

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!gloucoseData.date || !gloucoseData.time || !gloucoseData.glucoseLevel) {
            toast.warning("لطفا فیلدهای ضروری را پر کنید.");
            return;
        }

        setLoading(true);

        toast.info("لطفاً صبر کنید...");

        try {
            //بررسی وجود داده مشابه
            const query = encodeURIComponent(
                `date='${gloucoseData.date}' AND time='${gloucoseData.time}'`
            );

            const checkRes = await fetch(
                `https://api.backendless.com/F709728E-F527-4D4C-B3DA-C415F4581F77/D270E61A-C6A4-4589-88B4-4AF48BF29ABB/data/glucoseData?where=${query}`
            );

            const existing = await checkRes.json();

            if (existing.length > 0) {
                toast.error("داده‌ای با این تاریخ و ساعت قبلاً ثبت شده است!");
                setLoading(false); // دوباره فعال شد
                return;
            }

            //ذخیره داده جدید
            const response = await fetch(
                "https://api.backendless.com/F709728E-F527-4D4C-B3DA-C415F4581F77/D270E61A-C6A4-4589-88B4-4AF48BF29ABB/data/glucoseData",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(gloucoseData),
                }
            );

            const data = await response.json();
            console.log("✅ ثبت شد:", data);
            toast.success("قند خون با موفقیت ثبت شد!");
            reload();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("ارتباط با سرور برقرار نشد!");
        } finally {
            setLoading(false); // بعد از همه کارها، دکمه دوباره فعال شد
        }
    };

    return (
        <div className='modal'>
            <div className='modal__content'>
                <h2 className='modal__title'>ثبت قند خون جدید</h2>
                <form className='modal__form' onSubmit={handleFormSubmit}>
                    <div className='modal__label'>
                        تاریخ:
                        <DatePicker
                            className='bg-dark'
                            inputClass='modal__input'
                            calendar={persian}
                            locale={persian_fa}
                            arrow={false}
                            calendarPosition="bottom-right"
                            placeholder='۱۴۰۰/۱۱/۱۵'
                            required
                            onChange={(date) => setGlucoseLevel({ ...gloucoseData, date: date.format() })}
                        />
                        <CalendarDays className='modal__input__icon' />
                    </div>
                    <div className='modal__label'>
                        ساعت:
                        <input
                            type="time"
                            className='modal__input'
                            required
                            onChange={(e) => setGlucoseLevel({ ...gloucoseData, time: e.target.value })}
                        />
                        <ClockIcon className='modal__input__icon' />
                    </div>
                    <div className='modal__label'>
                        قند خون:
                        <input
                            type="number"
                            inputMode='numeric'
                            className='modal__input'
                            placeholder='120'
                            required
                            onChange={(e) => setGlucoseLevel({ ...gloucoseData, glucoseLevel: e.target.value })}
                        />
                        <Binary className='modal__input__icon' />
                    </div>
                    <div className='modal__label'>
                        انسولین (واحد):
                        <input
                            type="number"
                            inputMode='numeric'
                            className='modal__input'
                            placeholder='7'
                            onChange={(e) => setGlucoseLevel({ ...gloucoseData, insulinUnits: e.target.value })}
                        />
                        <Syringe className='modal__input__icon' />
                    </div>
                    <div className='modal__buttons'>
                        <button
                            type='submit'
                            disabled={loading}
                            className='modal__button modal__button--submit'
                        >ثبت</button>
                        <button
                            type="button"
                            disabled={loading}
                            className='modal__button modal__button--cancel'
                            onClick={onClose}
                        >انصراف</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
