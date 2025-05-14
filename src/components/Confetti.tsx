
import { useEffect, useState } from "react";

interface ConfettiProps {
  active: boolean;
  count?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ active, count = 50 }) => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    if (active) {
      const newParticles: JSX.Element[] = [];
      const colors = ["#9b87f5", "#FDE1D3", "#D3E4FD", "#ffcc00", "#ff77cc"];
      
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 8 + 4; // 4-12px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100; // 0-100%
        const animationDuration = Math.random() * 3 + 2; // 2-5s
        const delay = Math.random() * 0.5; // 0-0.5s
        
        newParticles.push(
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: "-20px",
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: "50%",
              animation: `confetti ${animationDuration}s ease-out forwards`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      }
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [active, count]);
  
  return <div className="pointer-events-none fixed inset-0 overflow-hidden">{particles}</div>;
};

export default Confetti;
