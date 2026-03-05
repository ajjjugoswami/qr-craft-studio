import { useScrollAnimation } from "../hooks/useScrollAnimation";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-500 ease-out will-change-[opacity,transform] ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
        minHeight: 0,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
