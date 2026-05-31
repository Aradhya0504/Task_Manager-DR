const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
};

const Button = ({ children, variant = 'primary', disabled, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
