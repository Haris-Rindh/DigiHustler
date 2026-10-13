import React from 'react';
import logoImg from '../../assets/logo.png';

interface LogoBadgeProps {
  className?: string;
  imgClassName?: string;
  textClassName?: string;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({
  className = '',
  imgClassName = 'w-7 h-7',
  textClassName = 'text-lg',
}) => {
  return (
    <div
      className={`bg-white rounded-xl px-3 py-1.5 border border-black/10 shadow-sm inline-flex items-center space-x-2.5 select-none transition-shadow hover:shadow-md ${className}`}
    >
      <img
        src={logoImg}
        alt="DigiHust Logo"
        width={28}
        height={28}
        className={`object-contain shrink-0 ${imgClassName}`}
      />
      <span
        className={`font-display font-extrabold tracking-tight text-[#022B3A] leading-none ${textClassName}`}
      >
        DigiHust
      </span>
    </div>
  );
};
