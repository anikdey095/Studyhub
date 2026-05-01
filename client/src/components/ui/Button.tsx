import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  text: string;
  isLoading: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, isLoading, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {isLoading ? <Loader2 className="animate-spin" /> : text}
    </button>
  );
};

export default Button;