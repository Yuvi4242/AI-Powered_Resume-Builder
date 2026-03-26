import { useEffect, useRef, useState } from 'react';

const OTPInput = ({ length = 6, onChange, disabled }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Call parent onChange
    const otpString = newOtp.join('');
    onChange(otpString);

    // Move to next input
    if (element.value !== '' && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split('').concat(new Array(length).fill('')).slice(0, length);
    setOtp(newOtp);
    onChange(newOtp.join(''));

    if (inputRefs.current[length - 1]) {
      inputRefs.current[length - 1].focus();
    }
  };

  return (
    <div className="flex justify-center gap-2" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength="1"
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={disabled}
          className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
      ))}
    </div>
  );
};

export default OTPInput;