import { useEffect, useState } from "react";

interface FloatingCelebrationProps {
  message: string;
  onComplete: () => void;
}

export function FloatingCelebration({ message, onComplete }: FloatingCelebrationProps) {
  const [visible, setVisible] = useState(true);

  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500); // Allow time for exit animation
    }, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0% { transform: translate(-50%, 50px) scale(0.8); opacity: 0; }
          20% { transform: translate(-50%, -20px) scale(1.1); opacity: 1; }
          40% { transform: translate(-50%, 0px) scale(1); opacity: 1; }
          80% { transform: translate(-50%, -10px) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50px) scale(0.9); opacity: 0; }
        }
        
        .floating-3d-text {
          position: fixed;
          top: 40%;
          left: 50%;
          z-index: 9999;
          pointer-events: none; /* Lets users click through it */
          text-align: center;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 4rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #fff;
          
          /* The 3D Effect using layered shadows (Level 3 Bronze Theme) */
          text-shadow: 
            0 1px 0 #b45309,
            0 2px 0 #b45309,
            0 3px 0 #92400e,
            0 4px 0 #92400e,
            0 5px 0 #78350f,
            0 6px 10px rgba(0,0,0,0.5),
            0 15px 20px rgba(217,119,6,0.4);
            
          animation: floatUp 5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* Subtle glowing backdrop */
        .celebration-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9998;
          pointer-events: none;
          background: radial-gradient(circle at center, rgba(217, 119, 6, 0.15) 0%, transparent 60%);
          animation: fadeInOut 5s ease-in-out forwards;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      <div className="celebration-backdrop" />
      <div className="floating-3d-text">
        {message}
      </div>
    </>
  );
}
