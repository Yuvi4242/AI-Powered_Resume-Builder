import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiAlertCircle, FiArrowLeft, FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiZap } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import OTPInput from '../components/OTPInput';
import { authAPI } from '../utils/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [timer, setTimer] = useState(0);
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
    if (error) {
      setError('');
      setInputError(false);
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('Please enter your email');
      setInputError(true);
      setShakeKey(prev => prev + 1);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.forgotPassword({
        email: formData.email,
      });

      if (response.data.success) {
        setStep(2);
        setTimer(120);
        setSuccessMessage('OTP sent to your email');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setShakeKey(prev => prev + 1);
      setInputError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (formData.otp.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      setShakeKey(prev => prev + 1);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyResetOTP({
        email: formData.email,
        otp: formData.otp,
      });

      if (response.data.success) {
        setStep(3);
        setSuccessMessage('OTP verified successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
      setShakeKey(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please enter and confirm your new password');
      setShakeKey(prev => prev + 1);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setShakeKey(prev => prev + 1);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setShakeKey(prev => prev + 1);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.resetPassword({
        email: formData.email,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        setSuccessMessage('Password reset successful!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      setShakeKey(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await authAPI.forgotPassword({
        email: formData.email,
      });
      if (response.data.success) {
        setTimer(120);
        setSuccessMessage('OTP resent to your email');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
      setShakeKey(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  // Floating shapes for visual side
  const FloatingShapes = () => (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          y: [0, -40, 0],
          x: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-10 left-10"
      />
      <motion.div
        animate={{
          y: [0, 50, 0],
          x: [0, -40, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute w-80 h-80 bg-white/10 rounded-full blur-3xl bottom-20 right-20"
      />
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Forgot Password?';
      case 2: return 'Verify OTP';
      case 3: return 'Reset Password';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Enter your email to receive a password reset OTP';
      case 2: return 'Enter the 6-digit code sent to your email';
      case 3: return 'Enter your new password';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #3b82f6 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <motion.div
          key={shakeKey}
          animate={error ? {
            x: [0, -10, 10, -10, 10, -5, 5, 0],
          } : {}}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30"
            >
              <FiZap className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Resume</h1>
              <p className="text-sm text-gray-500">Builder Pro</p>
            </div>
          </motion.div>

          {/* Header */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            {getStepTitle()}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mb-8"
          >
            {getStepDescription()}
          </motion.p>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-3"
              >
                <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3"
              >
                <FiCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-700 text-sm font-medium">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1: Email Form */}
          {step === 1 && (
            <motion.form 
              onSubmit={handleSendOTP} 
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className="relative"
                >
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all disabled:bg-gray-100 ${
                      inputError 
                        ? 'border-red-400 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-primary-500 focus:border-transparent'
                    }`}
                    placeholder="Enter your email"
                  />
                </motion.div>
              </div>

              <motion.button
                whileHover={!isLoading ? { scale: 1.01, y: -2 } : {}}
                whileTap={!isLoading ? { scale: 0.99 } : {}}
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                  isLoading 
                    ? 'bg-gray-400 shadow-none' 
                    : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-primary-500/25 hover:shadow-primary-500/40'
                }`}
              >
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" 
                  />
                ) : (
                  'Send OTP'
                )}
              </motion.button>
            </motion.form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <motion.form 
              onSubmit={handleVerifyOTP} 
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <OTPInput 
                  value={formData.otp} 
                  onChange={(val) => setFormData(prev => ({ ...prev, otp: val }))} 
                  disabled={isLoading} 
                />
              </motion.div>

              <div className="text-center text-sm text-gray-600">
                {timer > 0 ? (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Resend OTP in <span className="font-medium">{formatTime(timer)}</span>
                  </motion.p>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Resend OTP
                  </motion.button>
                )}
              </div>

              <motion.button
                whileHover={!isLoading ? { scale: 1.01, y: -2 } : {}}
                whileTap={!isLoading ? { scale: 0.99 } : {}}
                type="submit"
                disabled={isLoading || formData.otp.length !== 6}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  setStep(1);
                  setFormData(prev => ({ ...prev, otp: '' }));
                }}
                disabled={isLoading}
                className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center gap-2"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            </motion.form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <motion.form 
              onSubmit={handleResetPassword} 
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className="relative"
                >
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-100"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </motion.div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  className="relative"
                >
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-100"
                    placeholder="Confirm new password"
                  />
                </motion.div>
              </div>

              <motion.button
                whileHover={!isLoading ? { scale: 1.01, y: -2 } : {}}
                whileTap={!isLoading ? { scale: 0.99 } : {}}
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                  isLoading 
                    ? 'bg-gray-400 shadow-none' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/25 hover:shadow-green-500/40'
                }`}
              >
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" 
                  />
                ) : (
                  <>
                    <FiCheck className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </motion.button>
            </motion.form>
          )}

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center text-gray-500"
          >
            Remember your password?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-accent-600 to-purple-700 items-center justify-center p-12 relative overflow-hidden"
      >
        <FloatingShapes />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10 text-center text-white"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20"
          >
            <FiZap className="w-16 h-16" />
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Reset Your Password
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/80 text-lg max-w-md"
          >
            Follow the steps to reset your password and regain access to your account.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
