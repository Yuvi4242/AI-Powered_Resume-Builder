import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiCheck, FiLock, FiMail, FiPhone, FiUser, FiZap } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import OTPInput from '../components/OTPInput';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccessMessage('');
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post('auth/send-otp', {
        name: formData.name,
        email: formData.email,
      });

      if (response.status === 200) {
        setStep(2);
        setTimer(120);
        setSuccessMessage('OTP sent to your email');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post('auth/send-otp', {
        name: formData.name,
        email: formData.email,
      });
      if (response.status === 200) {
        setTimer(120);
        setSuccessMessage('OTP sent to your email');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('auth/verify-otp', {
        email: formData.email,
        otp,
      });

      if (response.status === 200) {
        setStep(3);
        setSuccessMessage('OTP Verified successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('auth/signup', {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.status === 201) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-accent-500 to-primary-600 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated blobs */}
        <div className="blob blob-1 w-96 h-96 bg-white/10 rounded-full absolute top-20 right-20" />
        <div className="blob blob-2 w-80 h-80 bg-white/10 rounded-full absolute bottom-20 left-20" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center text-white"
        >
          <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <FiZap className="w-16 h-16" />
          </div>
          <h3 className="text-3xl font-bold mb-4">Start Building Today</h3>
          <p className="text-white/80 text-lg max-w-md">
            Join thousands of job seekers who have created professional resumes with our AI-powered builder.
          </p>
          
          <div className="mt-12 flex flex-col gap-4 text-left max-w-xs mx-auto">
            {[
              'AI-powered resume suggestions',
              'Multiple professional templates',
              'ATS-friendly formats',
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <FiCheck className="w-4 h-4" />
                </div>
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <FiZap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Resume</h1>
              <p className="text-sm text-gray-500">Builder Pro</p>
            </div>
          </div>

          {/* Header */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {step === 1 ? 'Create account' : step === 2 ? 'Verify OTP' : 'Create Password'}
          </h2>
          <p className="text-gray-500 mb-8">
            {step === 1 
              ? 'Enter your details to get started' 
              : step === 2 
                ? 'Enter the 6-digit code sent to your email'
                : 'Set a secure password for your account'
            }
          </p>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm"
              >
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-100"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-100"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Continue
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <OTPInput onChange={setOtp} disabled={isLoading} />
              </div>

              <div className="text-center text-sm text-gray-600">
                {timer > 0 ? (
                  <p>Resend OTP in <span className="font-medium">{formatTime(timer)}</span></p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-primary-600 hover:text-primary-700 font-medium disabled:text-gray-400"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </motion.button>

              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium"
              >
                Back to Signup
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-100"
                    placeholder="Create a password (min 8 chars)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-100"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isLoading}
                className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium"
              >
                Back to OTP
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
