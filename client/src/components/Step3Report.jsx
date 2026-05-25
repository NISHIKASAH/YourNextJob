import React from 'react'
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function Step3Report({ report }) {

  const {
    communication, confidence, correctness, finalScore, questionWiseScore = []
  } = report || {};

  const navigate = useNavigate();

  let PerformanceText = "";
  let shortTagLine = "";

  if (finalScore >= 8) {
    PerformanceText = "Excellent performance! You aced the interview with flying colors.";
    shortTagLine = "Outstanding!";
  }
  else if (finalScore >= 6) {
    PerformanceText = "Good job! You performed well in the interview, showing strong skills and potential.";
    shortTagLine = "Great work!";
  }
  else {
    PerformanceText = "Needs improvement. Consider reviewing your answers and practicing more for future interviews.";
    shortTagLine = "Keep practicing!";
  }

  let Score = finalScore;
  let Percentage = (finalScore / 10) * 100;






  const generatePDF = () => {


    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    //PDF title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;

    // underline
    doc.setDrawColor(34, 197, 94);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;
    // ================= FINAL SCORE BOX =================
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Final Score: ${finalScore}/10`,
      pageWidth / 2,
      currentY + 12,
      { align: "center" }
    );

    currentY += 30;

    // ================= SKILLS BOX =================
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");

    doc.setFontSize(12);

    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

    currentY += 20;

    // ================= ADVICE =================
    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice = "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
    }
      currentY += 20;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 50;


    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },

      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((question, index) => ([
        `Q${index + 1}`,
        question.question || 'N/A',
       `${question.score}/10`,
        question.feedback || 'N/A'
      ])),

      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",
      },

      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" }, // index
        1: { cellWidth: 55 }, // question
        2: { cellWidth: 20, halign: "center" }, // score
        3: { cellWidth: "auto" }, // feedback
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },

    });
    doc.save("AI_Interview_Report.pdf");

  }



  return (
    <div className='min-h-screen bg-slate-50 py-10 px-4 sm:px-6'>
      <div className='mx-auto w-full max-w-4xl space-y-6'>
        <div className='rounded-3xl border border-gray-200 bg-white shadow-sm'>
          <div className='rounded-3xl bg-emerald-600 px-6 py-5 text-white'>
             <button
            onClick={() => navigate("/")}
            className='mt-1 p-3 mb-3 rounded-full bg-white shadow hover:shadow-md transition'><FaArrowLeft className='text-gray-600' /></button>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs uppercase tracking-[0.24em] text-emerald-100/80'>Interview report</p>
                <h1 className='mt-2 text-2xl font-semibold'>Your AI Interview Summary</h1>
              </div>
            <div
            className='display flex gap-5'
            >
        
              <button
                type='button'
                onClick={generatePDF}
                className='rounded-xl bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100'>
                Download PDF
              </button>
            </div>
                
          
            </div>
             
          </div>

          <div className='p-6 space-y-6'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='rounded-2xl border border-gray-200 bg-emerald-50 p-4'>
                <p className='text-sm font-medium text-slate-600'>Final Score</p>
                <p className='mt-3 text-3xl font-semibold text-emerald-700'>{finalScore ?? 'N/A'}</p>
              </div>
              <div className='rounded-2xl border border-gray-200 bg-white p-4'>
                <p className='text-sm font-medium text-slate-600'>Confidence</p>
                <p className='mt-3 text-3xl font-semibold text-slate-900'>{confidence ?? 'N/A'}</p>
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='rounded-2xl border border-gray-200 bg-white p-4'>
                <p className='text-sm font-medium text-slate-600'>Communication</p>
                <p className='mt-3 text-3xl font-semibold text-slate-900'>{communication ?? 'N/A'}</p>
              </div>
              <div className='rounded-2xl border border-gray-200 bg-white p-4'>
                <p className='text-sm font-medium text-slate-600'>Correctness</p>
                <p className='mt-3 text-3xl font-semibold text-slate-900'>{correctness?? 'N/A'}</p>
              </div>
            </div>

            <div className='rounded-3xl border border-gray-200 bg-emerald-50 p-5'>
              <h2 className='text-lg font-semibold text-slate-900'>Feedback</h2>
              {questionWiseScore?.length ? (
                <div className='mt-4 space-y-4'>
                  {questionWiseScore.map((item, index) => (
                    <div key={`${item.question}-${index}`} className='rounded-2xl border border-gray-200 bg-white p-4'>
                      <p className='text-sm font-semibold text-slate-900'>Question {index + 1}</p>
                      <p className='mt-2 text-sm text-slate-600'>{item.question}</p>
                      <p className='mt-3 text-sm text-slate-700'>{item.feedback || 'No feedback available.'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='mt-4 text-sm text-slate-600'>No question feedback available yet.</p>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Step3Report
