import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg">
      <h2 className="text-4xl font-bold text-white text-center mb-2">{title}</h2>
      <p className="text-gray-400 text-center mb-8">{subtitle}</p>
      {children}
    </div>
  );
};

export default AuthCard;