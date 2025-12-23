import React, { useEffect, useRef, useState } from 'react';
import { postData } from '../api/service';
// import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import { Smartphone, Lock, ArrowRight, RefreshCw, CheckCircle, Loader2 } from 'lucide-react'; // Import Icons

const LoginWithOtpScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  // Kita ubah OTP menjadi array untuk input terpisah (misal 4 digit)
  const [otp, setOtp] = useState(['', '', '', '']); 
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(60);
  const intervalRef = useRef(null);
  const inputRefs = useRef([]); // Ref untuk input OTP

  // const navigate = useNavigate();

  // --- Logic Helper & Effects (Sama seperti sebelumnya) ---
  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('08')) return '+62' + cleaned.slice(1);
    if (cleaned.startsWith('62')) return '+62' + cleaned.slice(2);
    if (cleaned.startsWith('8')) return '+62' + cleaned;
    if (cleaned.startsWith('628')) return '+' + cleaned;
    if (cleaned.startsWith('+628')) return cleaned;
    return '+62' + cleaned;
  };

  useEffect(() => {
    if (step === 2 && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [step, timer]);

  // --- OTP Input Logic (Baru: Auto Focus) ---
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Pindah ke input berikutnya jika diisi
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Pindah ke input sebelumnya jika Backspace ditekan dan kosong
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4).split('');
    if (pastedData.every(char => !isNaN(char))) {
        const newOtp = [...otp];
        pastedData.forEach((val, i) => {
            if(i < 4) newOtp[i] = val;
        });
        setOtp(newOtp);
    }
  };

  // --- API Calls ---
  const sendOtp = async () => {
    if (!phoneNumber.trim()) {
      alert("Nomor ponsel tidak boleh kosong.");
      return;
    }
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const formData = { phonenumber: formattedPhone };

    setLoading(true);
    try {
      await postData('otp/sendWA', formData);
      localStorage.setItem('phonenumber', formattedPhone);
      setStep(2);
      setTimer(60);
    } catch (error) {
      alert("Gagal mengirim OTP.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length < 4) {
      alert("OTP harus lengkap.");
      return;
    }

    setLoading(true);
    try {
      const phonenumber = localStorage.getItem('phonenumber');
      const response = await postData('otp/validateWA', {
        phonenumber,
        code: otpString
      });
      localStorage.setItem('accessTokens', response.message.accessToken);
      // navigate('/HomeScreen/DashboardScreen');
      alert("Login Berhasil!"); // Feedback sementara
      window.location.reload(); // Muat ulang aplikasi untuk memperbarui status login
    } catch (error) {
      alert(error?.response?.data?.message || "Verifikasi OTP gagal.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const phonenumber = localStorage.getItem('phonenumber');
      await postData('otp/sendWA', { phonenumber });
      setTimer(60);
    } catch (error) {
      alert("Gagal mengirim ulang OTP.");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-orange-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100"
      >
        {/* Header Section */}
        <div className="bg-blue-400 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-y-6"></div>
            <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex justify-center mb-4"
            >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    {step === 1 ? <Smartphone className="w-8 h-8 text-blue-500" /> : <Lock className="w-8 h-8 text-blue-500" />}
                </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 relative z-10">
                {step === 1 ? 'Selamat Datang' : 'Verifikasi OTP'}
            </h2>
            <p className="text-blue-900 opacity-80 mt-2 relative z-10">
                {step === 1 ? 'Masuk untuk melanjutkan ke aplikasi' : 'Kode telah dikirim ke WhatsApp Anda'}
            </p>
        </div>

        {/* Body Section */}
        <div className="p-8">
          <AnimatePresence mode='wait'>
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Nomor WhatsApp</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">+62</span>
                    <input
                      type="tel"
                      placeholder="81234567890"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-medium text-lg text-gray-700"
                      value={phoneNumber.replace(/^0|^\+62|^62/, '')} // Visual trim
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Kirim Kode OTP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center gap-3 mb-8">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-14 h-14 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-gray-800"
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    {timer > 0 ? (
                        <>Mohon tunggu <span className="font-bold text-blue-600">{formatTime(timer)}</span></>
                    ) : (
                        <span>Tidak menerima kode?</span>
                    )}
                  </div>
                  <button
                    onClick={handleResend}
                    disabled={timer > 0}
                    className={`text-sm font-semibold flex items-center gap-1 ${
                        timer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    <RefreshCw className={`w-3 h-3 ${timer > 0 ? '' : 'hover:rotate-180 transition-transform'}`} /> Kirim Ulang
                  </button>
                </div>

                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="w-full bg-blue-400 hover:bg-blue-500 text-blue-950 font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Verifikasi <CheckCircle className="w-5 h-5" /></>}
                </button>
                
                <div className="mt-4 text-center">
                    <button 
                        onClick={() => { setStep(1); setOtp(['','','','']); }} 
                        className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                        Ubah Nomor Ponsel
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginWithOtpScreen;