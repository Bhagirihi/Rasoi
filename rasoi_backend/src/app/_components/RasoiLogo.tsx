import Image from 'next/image';

const sizes = {
  sm: 40,
  md: 44,
  lg: 64,
} as const;

type RasoiLogoProps = {
  size?: keyof typeof sizes;
  className?: string;
  priority?: boolean;
};

export default function RasoiLogo({ size = 'md', className = '', priority = false }: RasoiLogoProps) {
  const dim = sizes[size];

  return (
    <Image
      src="/rasoi-logo.png"
      alt="Rasoi"
      width={dim}
      height={dim}
      priority={priority}
      className={`rounded-2xl object-contain ${className}`}
    />
  );
}
