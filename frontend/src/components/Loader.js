
const Loader = ({ size = 'medium', text = '' }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      ></div>
      {text && <p className="mt-3 text-gray-600 font-medium">{text}</p>}
    </div>
  );
};

export default Loader;
