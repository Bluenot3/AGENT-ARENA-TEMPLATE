
import React from 'react';

interface LogoProps {
  className?: string;
  animated?: boolean;
}

export default function Logo({ className = "w-6 h-6", animated = true }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? 'zen-logo-animated' : ''}`}
    >
      <defs>
        {/* Gradient for the glow effect */}
        <linearGradient id="zenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Animated gradient */}
        <linearGradient id="zenGradientAnimated" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6">
            <animate attributeName="stop-color" values="#3b82f6;#06b6d4;#8b5cf6;#3b82f6" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#06b6d4">
            <animate attributeName="stop-color" values="#06b6d4;#8b5cf6;#3b82f6;#06b6d4" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#8b5cf6">
            <animate attributeName="stop-color" values="#8b5cf6;#3b82f6;#06b6d4;#8b5cf6" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>

        {/* Glow filter */}
        <filter id="zenGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer frame - top-left to bottom-right diagonal */}
      <g filter={animated ? "url(#zenGlow)" : undefined}>
        {/* Top bar */}
        <path
          d="M10 10 L90 10 L90 22 L10 22 Z"
          fill={animated ? "url(#zenGradientAnimated)" : "currentColor"}
          className={animated ? "zen-path-1" : ""}
        >
          {animated && <animate attributeName="opacity" values="0;1" dur="0.3s" fill="freeze" />}
        </path>

        {/* Right bar */}
        <path
          d="M78 10 L90 10 L90 90 L78 90 Z"
          fill={animated ? "url(#zenGradientAnimated)" : "currentColor"}
          className={animated ? "zen-path-2" : ""}
        >
          {animated && <animate attributeName="opacity" values="0;1" dur="0.3s" begin="0.1s" fill="freeze" />}
        </path>

        {/* Bottom bar */}
        <path
          d="M10 78 L90 78 L90 90 L10 90 Z"
          fill={animated ? "url(#zenGradientAnimated)" : "currentColor"}
          className={animated ? "zen-path-3" : ""}
        >
          {animated && <animate attributeName="opacity" values="0;1" dur="0.3s" begin="0.2s" fill="freeze" />}
        </path>

        {/* Left bar */}
        <path
          d="M10 10 L22 10 L22 90 L10 90 Z"
          fill={animated ? "url(#zenGradientAnimated)" : "currentColor"}
          className={animated ? "zen-path-4" : ""}
        >
          {animated && <animate attributeName="opacity" values="0;1" dur="0.3s" begin="0.3s" fill="freeze" />}
        </path>

        {/* Diagonal stripe 1 - top */}
        <path
          d="M30 10 L42 10 L10 42 L10 30 Z"
          fill={animated ? "url(#zenGradientAnimated)" : "currentColor"}
          className={animated ? "zen-stripe" : ""}
        >
          {animated && <animate attributeName="opacity" values="0;1" dur="0.2s" begin="0.4s" fill="freeze" />}
        </path>

        {/* Diagonal stripe 2 - middle-top */}
        <path
          d="M54 10 L66 10 L10 66 L10 54 Z"
          fill={animated ? "url(#zenGradientAnimated)" : "currentColor"}
          className={animated ? "zen-stripe" : ""}
        >
          {animated && <animate attributeName="opacity" values="0;1" dur="0.2s" begin="0.5s" fill="freeze" />}
        </path>

        {/* Diagonal stripe 3 - middle */}
        <path
          d="M78 10 L90 22 L22 90 L10 78 Z"
          fill={animated ? "url(#zenGradientAnimated)" : "currentColor"}
          className={animated ? "zen-stripe zen-stripe-main" : ""}
        >
          {animated && <animate attributeName="opacity" values="0;1" dur="0.2s" begin="0.6s" fill="freeze" />}
        </path>

        {/* Diagonal stripe 4 - middle-bottom */}
        <path
          d="M90 34 L90 46 L46 90 L34 90 Z"
          fill={animated ? "url(#zenGradientAnimated)" : "currentColor"}
          className={animated ? "zen-stripe" : ""}
        >
          {animated && <animate attributeName="opacity" values="0;1" dur="0.2s" begin="0.7s" fill="freeze" />}
        </path>

        {/* Diagonal stripe 5 - bottom */}
        <path
          d="M90 58 L90 70 L70 90 L58 90 Z"
          fill={animated ? "url(#zenGradientAnimated)" : "currentColor"}
          className={animated ? "zen-stripe" : ""}
        >
          {animated && <animate attributeName="opacity" values="0;1" dur="0.2s" begin="0.8s" fill="freeze" />}
        </path>
      </g>
    </svg>
  );
}

// CSS for the animated logo (add to index.html or a global CSS file)
export const logoStyles = `
  .zen-logo-animated {
    filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
  }
  
  .zen-logo-animated:hover {
    filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.8));
    transform: scale(1.05);
    transition: all 0.3s ease;
  }
  
  .zen-stripe {
    transform-origin: center;
  }
  
  .zen-logo-animated:hover .zen-stripe-main {
    animation: zenPulse 1.5s ease-in-out infinite;
  }
  
  @keyframes zenPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;
