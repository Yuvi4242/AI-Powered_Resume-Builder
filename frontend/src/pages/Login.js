import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiAlertCircle, FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiPhone, FiZap } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, setToken } from '../utils/api';
import OTPInput from '../components/OTPInput';
import { Button } from '../components/ui/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState({ email: false, password: false });
  const [shakeKey, setShakeKey] = useState(0); // To trigger shake animation
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
      setInputError({ email: false, password: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      setInputError({ email: !formData.email, password: !formData.password });
      setShakeKey(prev => prev + 1);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setShakeKey(prev => prev + 1);
      setInputError({ email: true, password: true });
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
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );

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
          key={shakeKey} // Triggers re-render for shake animation
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
            Welcome back!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mb-8"
          >
            Sign in to your account to continue
          </motion.p>

          {/* Error Message with Animation */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-3"
              >
                <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>



          {/* Login Form */}
            <form 
              onSubmit={handleSubmit} 
              className="space-y-5"
            >
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
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
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 transition-all disabled:bg-gray-100 ${
                      inputError.email ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500'
                    }`}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-xs text-primary-600 font-bold">Forgot?</Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={`w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 transition-all disabled:bg-gray-100 ${
                      inputError.password ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500'
                    }`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-lg font-black shadow-2xl shadow-primary-500/20"
              >
                {isLoading ? 'Processing...' : 'Sign In'}
              </Button>
            </form>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center text-gray-500"
          >
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Sign up
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
            Build Professional Resumes
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/80 text-lg max-w-md"
          >
            Create stunning resumes with AI-powered features. Stand out from the crowd and land your dream job.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
