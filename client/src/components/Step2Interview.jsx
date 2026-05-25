import React from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import { motion } from "motion/react"
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { ServerUrl } from '../App'
import { BsArrowRight } from 'react-icons/bs'

import Timer from './Timer'


function Step2Interview({ interviewData, onFinish }) {

  const {
    interviewId,
    questions,
    userName } = interviewData;

  const [currIndex, setCurrIndex] = useState(0);
  const [micOn, setMicOn] = useState(false);
  const recoginisationRef = useRef(null);
  const [introPhase, setIntroPhase] = useState(true);
  const videoRef = useRef();
  const [answer, setAnswer] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [gendervoice, setGenderVoice] = useState("female");
  const [selectVoice, setSelectVoice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [feedback, setFeedback] = useState("");
  const [isAiPlaying, setAiPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState("");
const answerRef = useRef("");
const [, setIsListening] = useState(false);

  const currQuestion = questions[currIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) return;

      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha")
      );

      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark")
      );

      if (femaleVoice) {
        setSelectVoice(femaleVoice);
        setGenderVoice("female");
      } else if (maleVoice) {
        setSelectVoice(maleVoice);
        setGenderVoice("male");
      } else {
        setSelectVoice(voices[0]);
      }
    };

    loadVoices();

    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const videoSouce = gendervoice == "male" ? maleVideo : femaleVideo;


  function startMic() {
    const recognition = recoginisationRef.current;

    if (!recognition) return false;
    if (isAiPlaying) return false;
    if (recognitionActiveRef.current) {
      console.log("Recognition already active, skipping start");
      return false;
    }

    try {
      recognition.start();
      return true;
    } catch (err) {
      console.error("Error starting recognition", err);
      return false;
    }
  }

  function stopMic() {
    const recognition = recoginisationRef.current;
    if (!recognition) return;

    try {
      recognition.stop();
    } catch (err) {
      console.warn("Error stopping recognition", err);
    }
  }

  function toggleMic() {
    if (micOn) {
      stopMic();
      setMicOn(false);
    } else {
      const started = startMic();
      if (started) {
        setMicOn(true);
      }
    }
  }

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectVoice) {
        resolve();
        return;
      }


      window.speechSynthesis.cancel();

      const humanText = String(text)
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectVoice;
      utterance.rate = 0.92;     // slightly slower than normal
      utterance.pitch = 1.05;    // small warmth
      utterance.volume = 1;

      utterance.onstart = () => {
        setAiPlaying(true);
        stopMic();
        videoRef.current?.play().catch((err) => {
          console.log("video play error", err);
        });
      }
      utterance.onend = () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        setAiPlaying(false);

        if (micOn) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle("")
          resolve();
        }, 300);

      }
      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    })
  }



  useEffect(() => {

    if (!selectVoice) return;

    const runIntro = async () => {
      if (introPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );
        setIntroPhase(false);
      }

      else if (currQuestion) {
        await new Promise(r => setTimeout(r, 800));

        // If last question (hard level)
        if (currIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currQuestion.question);

        if (micOn) {
          startMic();
        }
      }


    }
    runIntro();

  }, [selectVoice, introPhase, currIndex]);


  useEffect(() => {

    if (introPhase) return;
    if (!currQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer)
  }, [introPhase, currIndex]);


  useEffect(() => {
    if (!introPhase && currQuestion) {
      setTimeLeft(currQuestion.timeLimit || 60);
    }
  }, [currIndex]);


  // useEffect(() => {
  //   if (!("webkitSpeechRecognition" in window)) return;

  //   const recognition = new window.webkitSpeechRecognition();
  //   recognition.lang = "en-US";
  //   recognition.continuous = true;
  //   recognition.interimResults = false;

  //   recognition.onresult = (event) => {
  //     const transcript =
  //       event.results[event.results.length - 1][0].transcript;

  //     setAnswer((prev) => prev + " " + transcript);
  //   };
  //   console.log("reco"  , recognition)
  //   recoginisationRef.current = recognition;

  // }, []);\\

  const addAnswer = (val) => {
    const next = typeof val === "function" ? val(answerRef.current) : val;
    answerRef.current = next;
    setAnswer(next);
  };

  const speechRecognitionInitialized = useRef(false);
  const recognitionActiveRef = useRef(false);

  useEffect(() => {
    if (speechRecognitionInitialized.current) return;
    speechRecognitionInitialized.current = true;

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.log("Speech recognition not supported");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        recognitionActiveRef.current = true;
      };

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        if (!transcript) return;
        addAnswer((prev) => {
          const next = prev ? `${prev} ${transcript}` : transcript;
          return next;
        });
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionActiveRef.current = false;
      };

      recognition.onerror = () => {
        setIsListening(false);
        recognitionActiveRef.current = false;
      };

      recoginisationRef.current = recognition;
      console.log("reco", recoginisationRef.current);

      return () => {
        try {
          recognition.stop();
        } catch (error) {
          console.warn("Error stopping recognition on cleanup", error);
        }
        recognitionActiveRef.current = false;
      };
    } catch (error) {
      console.error(error);
    }
  }, []);



  // const startMic = () => {

  //   console.log("startmiccurrent" , recoginisationRef.current);
  //   if (!isAiPlaying && recoginisationRef.current) {
  //     try {
  //       recoginisationRef.current.start();
  //     }
  //     catch (error) {
  //       console.log("err when mic start", error)
  //     }
  //   }

  // }


  const submitAnswer = async () => {

    if (isSubmit) return;

    const trimmedAnswer = answerRef.current?.trim();
    if (!trimmedAnswer) {
      window.alert("Please record or type your answer before submitting.");
      return;
    }

    stopMic();
    setIsSubmit(true);

    try {
      console.log("answer", trimmedAnswer)
      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currIndex,
          answer: trimmedAnswer,
          timeTaken: currQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true }
      );
      console.log(result);
      

      setFeedback(result.data.feedback);
      await speakText(result.data.feedback);
      setIsSubmit(false);

    }
    catch (error) {
      console.log("while submitting", error);
      setIsSubmit(false);
    }
  }

  const handleNext = async () => {
    try {
      setAnswer("");
      answerRef.current = "";
      setFeedback("");
      startMic();

      // if (currIndex + 1 >= questions.length) {
      //   console.log("Interview finished");
      //   finishInterview();
      //   return;
      // }
      if (currIndex + 1 >= 1) {
        console.log("Interview finished");
        finishInterview();
        return;
      }

      setCurrIndex((prev) => prev + 1);

    } catch (error) {
      console.log("handnextbtn ", error);
    }
  };

  const finishInterview = async () => {

    stopMic();
    setMicOn(false);

    try {
     
      const result = await axios.post(ServerUrl + "/api/interview/finish", { interviewId }, { withCredentials: true })
      console.log("interview result", result);
      onFinish(result.data)
    } catch (error) {
      console.log("while finishing interview ", error);
    }

  }

  
   useEffect(() => {
    if (introPhase) return;
    if (!currQuestion) return;

    if (timeLeft === 0 && !isSubmit && !feedback) {
      submitAnswer()
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recoginisationRef.current) {
        recoginisationRef.current.stop();
        recoginisationRef.current.abort();
      }

      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>

        {/* video section */}
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video
              src={videoSouce}
              key={videoSouce}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* subtitle */}
          {subtitle && (
            <div className='w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm'>
              <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
            </div>
          )}


          {/* timer Area */}
          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-500'>
                Interview Status
              </span>
              {isAiPlaying && <span className='text-sm font-semibold text-emerald-600'>
                {isAiPlaying ? "AI Speaking" : ""}
              </span>}
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className='flex justify-center'>

              <Timer timeLeft={timeLeft} totalTime={currQuestion?.timeLimit} />
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-bold text-emerald-600'>{currIndex + 1}</span>
                <span className='text-xs text-gray-400'>Current Questions</span>
              </div>

              <div>
                <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
                <span className='text-xs text-gray-400'>Total Questions</span>
              </div>
            </div>


          </div>
        </div>

        {/* Text section */}

        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
          <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>
            AI Smart Interview
          </h2>


          {!introPhase && (<div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
            <p className='text-xs sm:text-sm text-gray-400 mb-2'>
              Question {currIndex + 1} of {questions.length}
            </p>

            <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed '>{currQuestion?.question}</div>
          </div>)
          }
          <textarea
            placeholder="Type your answer here..."
            onChange={(e) => addAnswer(e.target.value)}
            value={answer}
            className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800" />


         {!feedback ? ( <div className='flex items-center gap-4 mt-6'>
            <motion.button
              onClick={toggleMic}
              whileTap={{ scale: 0.9 }}
              className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg'>
              {micOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20}/>}
            </motion.button>

            <motion.button
            onClick={submitAnswer}
            disabled={isSubmit}
              whileTap={{ scale: 0.95 }}
              className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-500'>
              {isSubmit?"Submitting...":"Submit Answer"}

            </motion.button>

          </div>):(
            <motion.div 
             initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            className='mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm'>
              <p className='text-emerald-700 font-medium mb-4'>{feedback}</p>

              <button
              onClick={handleNext}

               className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1'>
                Next Question <BsArrowRight size={18}/>
              </button>

            </motion.div>
          )}
        </div>
      </div>

    </div>
  )
}


export default Step2Interview
