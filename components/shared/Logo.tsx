import Image from 'next/image';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const sizeClasses: Record<LogoSize, string> = {
  xs: 'w-5 h-5',
  sm: 'w-6 h-6 md:w-7 md:h-7',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const sizePx: Record<LogoSize, number> = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 64,
  xl: 96,
};

export default function Logo({ size = 'sm', className = '' }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="SOGAfrika Logo"
      width={sizePx[size]}
      height={sizePx[size]}
      className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
    />
  );
}
