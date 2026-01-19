/**
 * ZEN Elite Icon Collection
 * Custom premium icons specifically designed for ZEN AI Co. branding
 */

import React from 'react';

interface IconProps {
    size?: number;
    className?: string;
    strokeWidth?: number;
    animated?: boolean;
}

// Elite Logo Icon - ZEN Symbol
export const ZenSymbol = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        className={`${className} ${animated ? 'zen-icon-glow' : ''}`}
    >
        <defs>
            <linearGradient id="zenEliteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6">
                    {animated && <animate attributeName="stop-color" values="#3b82f6;#06b6d4;#8b5cf6;#3b82f6" dur="3s" repeatCount="indefinite" />}
                </stop>
                <stop offset="50%" stopColor="#06b6d4">
                    {animated && <animate attributeName="stop-color" values="#06b6d4;#8b5cf6;#3b82f6;#06b6d4" dur="3s" repeatCount="indefinite" />}
                </stop>
                <stop offset="100%" stopColor="#8b5cf6">
                    {animated && <animate attributeName="stop-color" values="#8b5cf6;#3b82f6;#06b6d4;#8b5cf6" dur="3s" repeatCount="indefinite" />}
                </stop>
            </linearGradient>
            <filter id="zenGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter={animated ? "url(#zenGlow)" : undefined}>
            {/* Z-shaped Core with diagonal flow */}
            <path d="M15 15 L85 15 L85 27 L35 70 L85 70 L85 85 L15 85 L15 73 L65 30 L15 30 Z"
                fill={animated ? "url(#zenEliteGradient)" : "currentColor"} />
        </g>
    </svg>
);

// Elite Agent Icon
export const ZenAgent = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="agentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
        </defs>
        {/* Head/Core */}
        <circle cx="12" cy="8" r="4" fill="url(#agentGrad)" />
        {/* Body/Processing Unit */}
        <path d="M6 16a6 6 0 0112 0v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z" fill="url(#agentGrad)" opacity="0.8" />
        {/* Neural Pulse */}
        <circle cx="12" cy="8" r="6" stroke="url(#agentGrad)" strokeWidth="1" fill="none" opacity="0.4">
            {animated && <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />}
            {animated && <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />}
        </circle>
        {/* Status Indicator */}
        <circle cx="17" cy="6" r="2" fill="#22c55e">
            {animated && <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />}
        </circle>
    </svg>
);

// Elite Dashboard Icon
export const ZenDashboard = ({ size = 24, className = '', animated = false }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
        </defs>
        <rect x="3" y="3" width="8" height="8" rx="2" fill="url(#dashGrad)" />
        <rect x="13" y="3" width="8" height="5" rx="2" fill="url(#dashGrad)" opacity="0.7" />
        <rect x="3" y="13" width="8" height="8" rx="2" fill="url(#dashGrad)" opacity="0.5" />
        <rect x="13" y="10" width="8" height="11" rx="2" fill="url(#dashGrad)" opacity="0.8" />
    </svg>
);

// Elite Arena Icon
export const ZenArena = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="arenaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
        </defs>
        {/* Hexagonal Arena Shape */}
        <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="none" stroke="url(#arenaGrad)" strokeWidth="1.5" />
        {/* Inner Agents */}
        <circle cx="8" cy="10" r="2" fill="url(#arenaGrad)" opacity="0.8">
            {animated && <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />}
        </circle>
        <circle cx="16" cy="10" r="2" fill="url(#arenaGrad)" opacity="0.8">
            {animated && <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" begin="0.5s" repeatCount="indefinite" />}
        </circle>
        <circle cx="12" cy="15" r="2" fill="url(#arenaGrad)" opacity="0.8">
            {animated && <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" begin="1s" repeatCount="indefinite" />}
        </circle>
        {/* Connection Lines */}
        <line x1="8" y1="10" x2="16" y2="10" stroke="url(#arenaGrad)" strokeWidth="0.5" opacity="0.5" />
        <line x1="8" y1="10" x2="12" y2="15" stroke="url(#arenaGrad)" strokeWidth="0.5" opacity="0.5" />
        <line x1="16" y1="10" x2="12" y2="15" stroke="url(#arenaGrad)" strokeWidth="0.5" opacity="0.5" />
    </svg>
);

// Elite Knowledge Icon
export const ZenKnowledge = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="knowledgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
        </defs>
        {/* Book Shape */}
        <path d="M4 4a2 2 0 012-2h6v20H6a2 2 0 01-2-2V4z" fill="url(#knowledgeGrad)" opacity="0.7" />
        <path d="M12 2h6a2 2 0 012 2v16a2 2 0 01-2 2h-6V2z" fill="url(#knowledgeGrad)" />
        {/* Neural Pattern */}
        <circle cx="12" cy="10" r="3" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5">
            {animated && <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />}
        </circle>
        {/* Data Dots */}
        <circle cx="8" cy="8" r="0.5" fill="white" opacity="0.8" />
        <circle cx="8" cy="12" r="0.5" fill="white" opacity="0.8" />
        <circle cx="8" cy="16" r="0.5" fill="white" opacity="0.8" />
        <circle cx="16" cy="8" r="0.5" fill="white" opacity="0.8" />
        <circle cx="16" cy="12" r="0.5" fill="white" opacity="0.8" />
        <circle cx="16" cy="16" r="0.5" fill="white" opacity="0.8" />
    </svg>
);

// Elite Studio Icon
export const ZenStudio = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="studioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
        </defs>
        {/* Canvas Frame */}
        <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="url(#studioGrad)" strokeWidth="1.5" />
        {/* Creative Spark */}
        <path d="M12 8l1.5 2.5L16 11l-2.5 1.5L12 15l-1.5-2.5L8 11l2.5-1.5L12 8z" fill="url(#studioGrad)">
            {animated && <animate attributeName="transform" values="scale(1);scale(1.1);scale(1)" dur="1.5s" repeatCount="indefinite" type="scale" />}
        </path>
        {/* Toolbar Dots */}
        <circle cx="6" cy="7" r="1" fill="url(#studioGrad)" opacity="0.6" />
        <circle cx="9" cy="7" r="1" fill="url(#studioGrad)" opacity="0.6" />
        <circle cx="12" cy="7" r="1" fill="url(#studioGrad)" opacity="0.6" />
    </svg>
);

// Elite API Keys Icon
export const ZenKeys = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="keysGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
        </defs>
        {/* Key Body */}
        <path d="M15.5 2a4.5 4.5 0 00-4.47 4H7a2 2 0 00-2 2v1a2 2 0 002 2h4.03a4.5 4.5 0 104.47-9z" fill="url(#keysGrad)" opacity="0.9" />
        {/* Shield Emblem */}
        <path d="M12 14v7l-4-2V15a2 2 0 012-2h4a2 2 0 012 2v4l-4 2v-7z" fill="url(#keysGrad)" />
        {/* Secure Lock Indicator */}
        <circle cx="15.5" cy="6.5" r="1.5" fill="white" opacity="0.5">
            {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />}
        </circle>
    </svg>
);

// Elite Analytics Icon
export const ZenAnalytics = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="analyticsGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
        </defs>
        {/* Chart Bars */}
        <rect x="4" y="14" width="3" height="6" rx="1" fill="url(#analyticsGrad)" opacity="0.6">
            {animated && <animate attributeName="height" values="4;6;4" dur="1.5s" repeatCount="indefinite" />}
            {animated && <animate attributeName="y" values="16;14;16" dur="1.5s" repeatCount="indefinite" />}
        </rect>
        <rect x="9" y="10" width="3" height="10" rx="1" fill="url(#analyticsGrad)" opacity="0.8">
            {animated && <animate attributeName="height" values="8;10;8" dur="1.5s" begin="0.2s" repeatCount="indefinite" />}
            {animated && <animate attributeName="y" values="12;10;12" dur="1.5s" begin="0.2s" repeatCount="indefinite" />}
        </rect>
        <rect x="14" y="6" width="3" height="14" rx="1" fill="url(#analyticsGrad)">
            {animated && <animate attributeName="height" values="12;14;12" dur="1.5s" begin="0.4s" repeatCount="indefinite" />}
            {animated && <animate attributeName="y" values="8;6;8" dur="1.5s" begin="0.4s" repeatCount="indefinite" />}
        </rect>
        {/* Trend Line */}
        <polyline points="4,12 8,9 13,11 19,4" stroke="url(#analyticsGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Peak Indicator */}
        <circle cx="19" cy="4" r="2" fill="url(#analyticsGrad)">
            {animated && <animate attributeName="r" values="1.5;2.5;1.5" dur="1s" repeatCount="indefinite" />}
        </circle>
    </svg>
);

// Elite Subscription/Crown Icon
export const ZenCrown = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
        </defs>
        {/* Crown Base */}
        <path d="M3 18h18v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" fill="url(#crownGrad)" />
        {/* Crown Points */}
        <path d="M3 8l4 5 5-7 5 7 4-5v10H3V8z" fill="url(#crownGrad)" />
        {/* Gem Accents */}
        <circle cx="12" cy="6" r="1.5" fill="white" opacity="0.8">
            {animated && <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />}
        </circle>
        <circle cx="7" cy="10" r="1" fill="white" opacity="0.5" />
        <circle cx="17" cy="10" r="1" fill="white" opacity="0.5" />
    </svg>
);

// Elite Spark/AI Icon
export const ZenSpark = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
        </defs>
        {/* Main Spark */}
        <path d="M12 2l2 6h5l-4 4 2 6-5-3-5 3 2-6-4-4h5l2-6z" fill="url(#sparkGrad)">
            {animated && <animate attributeName="transform" values="scale(1);scale(1.05);scale(1)" dur="1.5s" repeatCount="indefinite" type="scale" />}
        </path>
        {/* Glow Ring */}
        <circle cx="12" cy="12" r="10" fill="none" stroke="url(#sparkGrad)" strokeWidth="0.5" opacity="0.3">
            {animated && <animate attributeName="r" values="9;11;9" dur="2s" repeatCount="indefinite" />}
            {animated && <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />}
        </circle>
    </svg>
);

// Elite Image Studio Icon
export const ZenImageStudio = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="imgStudioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
        </defs>
        {/* Frame */}
        <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="url(#imgStudioGrad)" strokeWidth="1.5" />
        {/* Mountain Scene */}
        <path d="M3 17l5-6 4 4 5-7 4 9H3z" fill="url(#imgStudioGrad)" opacity="0.8" />
        {/* Sun */}
        <circle cx="16" cy="8" r="2.5" fill="url(#imgStudioGrad)" opacity="0.6">
            {animated && <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />}
        </circle>
    </svg>
);

// Elite App Forge Icon
export const ZenAppForge = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="appForgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
        </defs>
        {/* Code Brackets */}
        <path d="M8 6l-5 6 5 6" stroke="url(#appForgeGrad)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 6l5 6-5 6" stroke="url(#appForgeGrad)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Center Slash */}
        <line x1="14" y1="4" x2="10" y2="20" stroke="url(#appForgeGrad)" strokeWidth="2" strokeLinecap="round" />
        {/* Forge Sparks */}
        {animated && (
            <>
                <circle cx="12" cy="8" r="0.5" fill="#22c55e" opacity="0.8">
                    <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="10" cy="14" r="0.5" fill="#22c55e" opacity="0.8">
                    <animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.3s" repeatCount="indefinite" />
                </circle>
                <circle cx="14" cy="12" r="0.5" fill="#22c55e" opacity="0.8">
                    <animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.6s" repeatCount="indefinite" />
                </circle>
            </>
        )}
    </svg>
);

// Elite Game Lab Icon
export const ZenGameLab = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="gameLabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
        </defs>
        {/* Controller Body */}
        <path d="M6 9a3 3 0 00-3 3v2a3 3 0 003 3h12a3 3 0 003-3v-2a3 3 0 00-3-3H6z" fill="url(#gameLabGrad)" />
        {/* D-Pad */}
        <rect x="5" y="11.5" width="4" height="1.5" rx="0.5" fill="white" opacity="0.8" />
        <rect x="6.25" y="10" width="1.5" height="4" rx="0.5" fill="white" opacity="0.8" />
        {/* Action Buttons */}
        <circle cx="16" cy="11" r="1" fill="white" opacity="0.8">
            {animated && <animate attributeName="opacity" values="0.8;1;0.8" dur="0.5s" repeatCount="indefinite" />}
        </circle>
        <circle cx="18" cy="13" r="1" fill="white" opacity="0.8">
            {animated && <animate attributeName="opacity" values="0.8;1;0.8" dur="0.5s" begin="0.15s" repeatCount="indefinite" />}
        </circle>
        {/* Lab Flask Top */}
        <path d="M10 5a2 2 0 014 0v4h-4V5z" fill="none" stroke="url(#gameLabGrad)" strokeWidth="1" />
        <circle cx="12" cy="5" r="0.5" fill="url(#gameLabGrad)" />
    </svg>
);

// Elite Settings/Config Icon  
export const ZenConfig = ({ size = 24, className = '', animated = true }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="configGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
        </defs>
        {/* Gear Outer */}
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="url(#configGrad)" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
            stroke="url(#configGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {animated && <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="10s" repeatCount="indefinite" />}
        </path>
    </svg>
);

// Elite Power/Logout Icon
export const ZenPower = ({ size = 24, className = '', animated = false }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="powerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
        </defs>
        {/* Power Symbol */}
        <path d="M18.36 6.64a9 9 0 11-12.73 0" stroke="url(#powerGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <line x1="12" y1="2" x2="12" y2="12" stroke="url(#powerGrad)" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Premium badge for Pro features
export const ZenPremiumBadge = ({ size = 24, className = '' }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
        <defs>
            <linearGradient id="premiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
        </defs>
        {/* Shield Shape */}
        <path d="M12 2L4 6v6c0 5.25 3.4 10.15 8 11.5 4.6-1.35 8-6.25 8-11.5V6l-8-4z" fill="url(#premiumGrad)" />
        {/* PRO Text */}
        <text x="12" y="14" textAnchor="middle" fontSize="6" fontWeight="bold" fill="white">PRO</text>
    </svg>
);

// Export all icons for easy importing
export const ZenIcons = {
    Symbol: ZenSymbol,
    Agent: ZenAgent,
    Dashboard: ZenDashboard,
    Arena: ZenArena,
    Knowledge: ZenKnowledge,
    Studio: ZenStudio,
    Keys: ZenKeys,
    Analytics: ZenAnalytics,
    Crown: ZenCrown,
    Spark: ZenSpark,
    ImageStudio: ZenImageStudio,
    AppForge: ZenAppForge,
    GameLab: ZenGameLab,
    Config: ZenConfig,
    Power: ZenPower,
    PremiumBadge: ZenPremiumBadge,
};

export default ZenIcons;
