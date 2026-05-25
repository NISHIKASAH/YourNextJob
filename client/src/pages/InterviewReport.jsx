import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from  'axios';
import { ServerUrl } from '../App.jsx';
import Step3Report from '../components/Step3Report.jsx';

function InterviewReport() {


const [report, setReport] = useState(null);
const { interviewId } = useParams();

useEffect(() => {
  const getReport = async () => {
    const result = await axios.get(`${ServerUrl}/api/interview/report/${interviewId}`, {
      withCredentials: true,
    });
    setReport(result.data);
    
  };
  if (interviewId) {
    getReport();
  }
}, [interviewId]);
  
  return (




    <div>

      {
        report == null ? (
          <div className='min-h-screen flex items-center justify-center bg-slate-50'>
            <p className='text-lg font-medium text-slate-500'>Loading your interview report...</p>
  </div>
        ) : (
          <Step3Report report={report} />
        )

      }
    </div>
      
   
  )
}

export default InterviewReport

