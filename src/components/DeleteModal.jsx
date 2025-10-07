import { useState } from 'react'
import { toast } from 'react-toastify';

export default function DeleteModal({ onClose, recordId, reload }) {

    const [loading, setLoading] = useState(false);

    const deleteHandler = async () => {
        try {

            setLoading(true);
            toast.info("لطفاً صبر کنید...");

            const response = await fetch(
                `https://api.backendless.com/F709728E-F527-4D4C-B3DA-C415F4581F77/D270E61A-C6A4-4589-88B4-4AF48BF29ABB/data/glucoseData/${recordId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errText = await response.text();
                console.error("خطا در حذف:", errText);
                return;
            }

            const data = await response.json();
            toast.success("رکورد با موفقیت حذف شد!");
            setLoading(false);
            reload();
            onClose();
        } catch (error) {
            console.error("❌ خطا در حذف:", error);
            toast.error("حذف رکورد انجام نشد!");
            setLoading(false);
        }
    };

    return (
        <div className='modal'>
            <div className='modal__content'>
                <h2 className='modal__title'>حذف رکورد</h2>
                <p className='modal__message'>آیا از حذف این رکورد اطمینان دارید؟ <br />این عمل قابل بازگشت نیست</p>
                <div className='modal__buttons'>
                    <button
                        className='modal__button modal__button--confirm'
                        onClick={deleteHandler}
                        disabled={loading}
                    >حذف</button>
                    <button
                        className='modal__button modal__button--cancel'
                        onClick={onClose}
                        disabled={loading}
                    >انصراف</button>
                </div>
            </div>
        </div>
    )
}
