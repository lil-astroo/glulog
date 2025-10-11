import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FilePlus2, Trash2 } from 'lucide-react'
import Modal from '../components/Modal'
import DeleteModal from '../components/DeleteModal';
import Loading from '../components/Loading';

import '../assets/styles/Records.css'

export default function Records() {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    const handleModalClose = () => setIsModalOpen(false);
    const handleDeleteModalClose = () => setIsDeleteModalOpen(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://api.backendless.com/F709728E-F527-4D4C-B3DA-C415F4581F77/D270E61A-C6A4-4589-88B4-4AF48BF29ABB/data/glucoseData?pageSize=100&sortBy=created%20desc');

            const data = await response.json();
            setLoading(false);
            setData(data);
        } catch (error) {
            console.error(error);
            toast.error("ارتباط با سرور برقرار نشد!");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='records'>
            <div className='records__container'>
                <div className='records__header'>
                    <button className="add-entry-button-records" onClick={() => setIsModalOpen(true)}>
                        <FilePlus2 className='add-entry-button-records-icon' />
                        ثبت قند خون جدید
                    </button>
                </div>
                <div className='records__body'>
                    <table>
                        <thead>
                            <tr>
                                <th>تاریخ</th>
                                <th>ساعت</th>
                                <th>قند خون</th>
                                <th>انسولین</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                        <Loading />
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>هیچ رکوردی یافت نشد</td>
                                </tr>
                            ) : (
                                data?.map((record) => (
                                    <tr key={record.objectId}>
                                        <td>{record.date}</td>
                                        <td>{record.time}</td>
                                        <td>{record.glucoseLevel} mg/dL</td>
                                        <td>{record.insulinUnits || '-'} units</td>
                                        <td><Trash2 className='actions_icon delete' onClick={() => { setIsDeleteModalOpen(true); setRecordToDelete(record.objectId) }} /></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <Modal onClose={handleModalClose} reload={fetchData} />}
            {isDeleteModalOpen && <DeleteModal onClose={handleDeleteModalClose} recordId={recordToDelete} reload={fetchData} />}
        </div>
    )
}
