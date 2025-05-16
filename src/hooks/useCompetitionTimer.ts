
import { useState, useEffect } from "react";
import { toast } from "sonner";

const useCompetitionTimer = (duration: number, onComplete: () => void) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(duration);
  
  // Format time display
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Timer effect
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      onComplete();
      toast.error("Time's up! Competition ended.");
    }
  }, [timeLeft, onComplete]);
  
  return { timeLeft, setTimeLeft, formatTime };
};

export default useCompetitionTimer;
