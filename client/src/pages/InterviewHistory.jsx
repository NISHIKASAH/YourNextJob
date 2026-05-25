import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ServerUrl } from '../App.jsx'
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function InterviewHistory() {

    const [history, setHistory] = useState([]);
     const navigate = useNavigate()

    useEffect(() => {

        const getHistory = async () => {
            const result = await axios.get(ServerUrl + "/api/interview/history", {
                withCredentials: true
            });
            setHistory(result.data?.interviews || []);
        }
        getHistory();

    }, [])

    return (
        <div className='min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='mx-auto w-full max-w-6xl space-y-8'>
                <header className='rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm'>
                    <button
                                    onClick={() => navigate("/")}
                                    className='mt-1 p-3 mb-3 rounded-full bg-white shadow hover:shadow-md transition'><FaArrowLeft className='text-gray-600' /></button>
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                         
                        <div>
                            <p className='text-sm uppercase tracking-[0.28em] text-emerald-600'>Interview history</p>
                            <h1 className='mt-3 text-3xl font-semibold text-slate-900'>Your latest mock interview sessions</h1>
                            <p className='mt-2 max-w-2xl text-sm text-slate-600'>Review completed interviews, scores, and feedback to track your progress over time.</p>
                        </div>
                        <div className='rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md'>
                            {history.length} completed interview{history.length === 1 ? '' : 's'}
                        </div>
                    </div>
                </header>

                {history.length === 0 ? (
                    <div className='rounded-[32px] border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm'>
                        <p className='text-lg font-medium'>No interviews available yet.</p>
                        <p className='mt-2 text-sm text-slate-500'>Complete an AI mock interview to see your history here.</p>
                    </div>
                ) : (
                    <div className='grid gap-6 lg:grid-cols-2'>
                        {history.map((item, index) => (
                            <div key={item._id || index}
                            onClick ={()=> navigate('/report/' + item._id)}
                             className='rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md'>
                                <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                                    <div>
                                        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-400'>Interview {index + 1}</p>
                                        <h2 className='mt-2 text-xl font-semibold text-slate-900'>{item.role || 'Unknown role'}</h2>
                                        <p className='mt-2 text-sm text-slate-500'>Completed on {new Date(item.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className='rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700'>
                                        {item.mode || 'Mode unknown'}
                                    </div>
                                </div>

        

                              
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default InterviewHistory
