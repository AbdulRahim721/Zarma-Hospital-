import React from 'react';

interface ClinicLogoProps {
  className?: string;
  size?: number;
  variant?: 'light' | 'colored' | 'inverted';
}

export const ClinicLogo: React.FC<ClinicLogoProps> = ({
  className = '',
  size = 110,
  variant = 'colored',
}) => {
  // Medical blue: #1a5f7a, Vibrant leaf green: #8bc34a, Darker green: #689f38
  const isLight = variant === 'light';

  return (
    <div
      id="clinic-logo-container"
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]"
        aria-label="ZARMA HOSPITAL Logo - Healthcare emblem with stylized figures and green leaves"
      >
        <defs>
          <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#ffffff' : '#ffffff'} stopOpacity={isLight ? '0.15' : '0.95'} />
            <stop offset="100%" stopColor={isLight ? '#ffffff' : '#f0f9ff'} stopOpacity={isLight ? '0.05' : '0.85'} />
          </linearGradient>

          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8bc34a" />
            <stop offset="100%" stopColor={isLight ? '#ffffff' : '#1a5f7a'} />
          </linearGradient>

          <linearGradient id="trunkGradCenter" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#ffffff' : '#1a5f7a'} />
            <stop offset="100%" stopColor={isLight ? '#e0f2fe' : '#134b61'} />
          </linearGradient>

          <linearGradient id="trunkGradSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#e2e8f0' : '#227293'} />
            <stop offset="100%" stopColor={isLight ? '#cbd5e1' : '#16526a'} />
          </linearGradient>

          <linearGradient id="leafGradPrimary" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7cb342" />
            <stop offset="60%" stopColor="#8bc34a" />
            <stop offset="100%" stopColor="#9ccc65" />
          </linearGradient>

          <linearGradient id="leafGradSecondary" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#689f38" />
            <stop offset="100%" stopColor="#8bc34a" />
          </linearGradient>
        </defs>

        {/* Outer Circular Boundary & Protective Halo */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="url(#circleGrad)"
          stroke="url(#ringGrad)"
          strokeWidth="3.5"
          className="transition-all duration-300"
        />

        {/* Inner subtle alignment orbit */}
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke={isLight ? '#ffffff' : '#1a5f7a'}
          strokeOpacity={isLight ? '0.2' : '0.12'}
          strokeWidth="1"
          strokeDasharray="3 4"
        />

        {/* TREE CANOPY - Stylized Foliage in Vibrant Green (#8bc34a) */}
        <g id="tree-foliage">
          {/* Central Top Leaf */}
          <path
            d="M100 28 C90 42, 90 56, 100 66 C110 56, 110 42, 100 28 Z"
            fill="url(#leafGradPrimary)"
          />
          {/* Left Upper Canopy Cluster */}
          <path
            d="M80 34 C68 45, 69 60, 84 66 C88 53, 91 43, 80 34 Z"
            fill="url(#leafGradPrimary)"
          />
          <path
            d="M60 48 C48 60, 52 75, 68 78 C73 66, 73 57, 60 48 Z"
            fill="url(#leafGradSecondary)"
          />
          <path
            d="M46 70 C36 82, 42 96, 58 96 C62 84, 59 76, 46 70 Z"
            fill="url(#leafGradPrimary)"
          />

          {/* Right Upper Canopy Cluster */}
          <path
            d="M120 34 C132 45, 131 60, 116 66 C112 53, 109 43, 120 34 Z"
            fill="url(#leafGradPrimary)"
          />
          <path
            d="M140 48 C152 60, 148 75, 132 78 C127 66, 127 57, 140 48 Z"
            fill="url(#leafGradSecondary)"
          />
          <path
            d="M154 70 C164 82, 158 96, 142 96 C138 84, 141 76, 154 70 Z"
            fill="url(#leafGradPrimary)"
          />

          {/* Mid-canopy filler leaves bridging figures and crown */}
          <ellipse cx="76" cy="74" rx="8" ry="12" transform="rotate(-35 76 74)" fill="#8bc34a" opacity="0.9" />
          <ellipse cx="124" cy="74" rx="8" ry="12" transform="rotate(35 124 74)" fill="#8bc34a" opacity="0.9" />
          <ellipse cx="100" cy="52" rx="7" ry="11" fill="#9ccc65" opacity="0.95" />
          
          {/* Subtle bud dots at branch ends */}
          <circle cx="91" cy="40" r="3" fill="#8bc34a" />
          <circle cx="109" cy="40" r="3" fill="#8bc34a" />
        </g>

        {/* THREE STYLIZED PEOPLE FORMING THE TRUNK */}
        <g id="three-people-trunk">
          {/* 1. Center Person (Head & Main Central Trunk Pillar) */}
          {/* Center Person Head */}
          <circle
            cx="100"
            cy="84"
            r="10.5"
            fill={isLight ? '#ffffff' : '#1a5f7a'}
          />

          {/* Center Person Body & Upward Reaching Arms / Main Trunk */}
          <path
            d="M100 97
               C93 103, 89 114, 91 130
               C93 145, 92 162, 94 172
               L106 172
               C108 162, 107 145, 109 130
               C111 114, 107 103, 100 97 Z"
            fill="url(#trunkGradCenter)"
          />
          {/* Center Branch Upward Flourish */}
          <path
            d="M96 102 C94 88, 86 78, 80 72 C83 80, 88 92, 95 106 Z"
            fill="url(#trunkGradCenter)"
            opacity="0.85"
          />
          <path
            d="M104 102 C106 88, 114 78, 120 72 C117 80, 112 92, 105 106 Z"
            fill="url(#trunkGradCenter)"
            opacity="0.85"
          />

          {/* 2. Left Person (Forming Left Root, Curving Trunk & Left Branch) */}
          {/* Left Person Head */}
          <circle
            cx="73"
            cy="104"
            r="8.5"
            fill={isLight ? '#e2e8f0' : '#227293'}
          />
          {/* Left Person Body & Outward Branching Arm */}
          <path
            d="M71 114
               C64 121, 62 134, 69 152
               C74 165, 84 171, 95 172
               C88 167, 83 158, 81 146
               C79 135, 79 126, 83 120
               C80 117, 75 115, 71 114 Z"
            fill="url(#trunkGradSide)"
          />
          {/* Left Figure's Upper Arm forming Branch to canopy */}
          <path
            d="M74 113 C70 102, 60 94, 52 90 C56 98, 64 107, 72 117 Z"
            fill="url(#trunkGradSide)"
          />

          {/* 3. Right Person (Forming Right Root, Curving Trunk & Right Branch) */}
          {/* Right Person Head */}
          <circle
            cx="127"
            cy="104"
            r="8.5"
            fill={isLight ? '#e2e8f0' : '#227293'}
          />
          {/* Right Person Body & Outward Branching Arm */}
          <path
            d="M129 114
               C136 121, 138 134, 131 152
               C126 165, 116 171, 105 172
               C112 167, 117 158, 119 146
               C121 135, 121 126, 117 120
               C120 117, 125 115, 129 114 Z"
            fill="url(#trunkGradSide)"
          />
          {/* Right Figure's Upper Arm forming Branch to canopy */}
          <path
            d="M126 113 C130 102, 140 94, 148 90 C144 98, 136 107, 128 117 Z"
            fill="url(#trunkGradSide)"
          />
        </g>

        {/* Tree Root Base / Earth Grounding Curve */}
        <path
          d="M66 172 C80 176, 120 176, 134 172 C124 170, 76 170, 66 172 Z"
          fill={isLight ? '#ffffff' : '#1a5f7a'}
          opacity={isLight ? '0.6' : '0.4'}
        />
      </svg>
    </div>
  );
};
