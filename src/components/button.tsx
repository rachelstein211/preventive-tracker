'use client';

export function Button({
  children,
  onClick,
  type = 'button',
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full bg-[#0EA5E9] text-white font-semibold px-4 py-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0EA5E9] ${className}`}
    >
      {children}
    </button>
  );
}