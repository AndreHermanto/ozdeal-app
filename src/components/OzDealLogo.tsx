import React, { useState } from "react";
// @ts-ignore
import ozdealImg from "../assets/images/ozdeal.png";

interface OzDealLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function OzDealLogo({ className = "", size = "md" }: OzDealLogoProps) {
  // Determine dimensions based on size prop
  const dimensions = {
    sm: "h-9 w-9",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  }[size];

  // State machine for logo loading to ensure 100% resilience:
  // 1. "imgur-direct" -> Try direct Imgur image URL (https://i.imgur.com/3cKdp6M.png)
  // 2. "imgur-direct-jpg" -> Try direct Imgur JPG URL (https://i.imgur.com/3cKdp6M.jpeg)
  // 3. "local-esm" -> Try Vite's ESM bundled PNG from assets
  // 4. "fallback-svg" -> Fallback to handcrafted beautiful responsive Vector
  const [loadState, setLoadState] = useState<"imgur-direct" | "imgur-direct-jpg" | "local-esm" | "fallback-svg">("imgur-direct");

  // If the state is trying one of the images, render it with dynamic onError handlers
  if (loadState === "imgur-direct") {
    return (
      <img
        src="https://i.imgur.com/3cKdp6M.png"
        alt="OzDeal Logo Imgur PNG"
        className={`${dimensions} object-contain transition-all duration-300 group-hover:scale-105 ${className}`}
        onError={() => setLoadState("imgur-direct-jpg")}
        referrerPolicy="no-referrer"
      />
    );
  }

  if (loadState === "imgur-direct-jpg") {
    return (
      <img
        src="https://i.imgur.com/3cKdp6M.jpg"
        alt="OzDeal Logo Imgur JPG"
        className={`${dimensions} object-contain transition-all duration-300 group-hover:scale-105 ${className}`}
        onError={() => setLoadState("local-esm")}
        referrerPolicy="no-referrer"
      />
    );
  }

  if (loadState === "local-esm") {
    return (
      <img
        src={ozdealImg}
        alt="OzDeal Logo Bundled"
        className={`${dimensions} object-contain transition-all duration-300 group-hover:scale-105 ${className}`}
        onError={() => setLoadState("fallback-svg")}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Fallback SVG: Clean, pixel-perfect modern vector of the Cool Kangaroo wearing $ Sunglasses
  return (
    <div className={`relative flex items-center justify-center select-none ${dimensions} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-all duration-300 group-hover:scale-105"
      >
        {/* Main Silhouette of Kangaroo Head & Ears (Deep Brand Blue #003B72) */}
        <path
          d="M 80 82 
             C 74 81, 68 68, 62 52 
             C 54 32, 52 20, 56 15 
             C 60 10, 72 16, 84 34 
             C 92 46, 98 62, 100 73
             C 102 62, 108 46, 116 34 
             C 128 16, 140 10, 144 15 
             C 148 20, 146 32, 138 52 
             C 132 68, 126 81, 120 82
             C 124 90, 132 100, 134 110
             C 136 120, 134 128, 124 136
             C 118 141, 112 143, 106 144
             C 108 152, 108 160, 106 168
             C 104 174, 98 178, 92 178
             C 87 178, 82 172, 81 165
             C 79 155, 77 145, 72 135
             C 66 125, 62 112, 62 100
             C 62 92, 66 86, 72 82 M 80 82"
          fill="#003B72"
        />

        {/* Left Inner Ear Highlight */}
        <path
          d="M 65 48 
             C 60 35, 58 25, 60 21 
             C 62 17, 69 21, 77 35 
             C 82 44, 85 54, 86 60
             C 82 58, 71 55, 65 48 Z"
          fill="#FFFFFF"
        />

        {/* Right Inner Ear Highlight */}
        <path
          d="M 135 48 
             C 140 35, 142 25, 140 21 
             C 138 17, 131 21, 123 35 
             C 118 44, 115 54, 114 60
             C 118 58, 129 55, 135 48 Z"
          fill="#FFFFFF"
        />

        {/* White Forehead, Face & Snout Base */}
        <path
          d="M 78 86
             C 85 80, 115 80, 122 86
             C 128 91, 132 99, 132 107
             C 132 115, 124 123, 116 127
             C 110 130, 102 130, 94 127
             C 86 123, 78 115, 76 105
             C 74 97, 75 91, 78 86 Z"
          fill="#FFFFFF"
        />

        {/* White Neck Highlight on Left Side */}
        <path
          d="M 76 126
             C 79 136, 82 146, 85 156
             C 87 162, 87 166, 83 166
             C 79 166, 75 156, 72 142
             C 70 132, 72 126, 76 126 Z"
          fill="#FFFFFF"
        />

        {/* Sunglasses Body (Deep Blue #003B72) */}
        <path
          d="M 76 94
             C 80 92, 94 92, 97 96
             C 99 98, 101 98, 103 96
             C 106 92, 120 92, 124 94
             C 127 95, 128 99, 126 104
             C 123 112, 115 118, 110 118
             C 107 118, 103 114, 101 110
             C 99 114, 95 118, 92 118
             C 87 118, 79 112, 76 104
             C 74 99, 75 95, 76 94 Z"
          fill="#003B72"
        />

        {/* White Dollar Sign ($) - Left Lens */}
        <g transform="translate(80, 97) scale(0.55)">
          <rect x="11" y="2" width="2" height="20" rx="1" fill="#FFFFFF" />
          <path
            d="M 17 7 
               C 17 4.8, 14.5 3.5, 12 3.5 
               C 8.5 3.5, 6.5 5.2, 6.5 7.5 
               C 6.5 10.5, 17.5 9.5, 17.5 13.5 
               C 17.5 16, 14.5 17.5, 12 17.5 
               C 9 17.5, 7 16, 7 14"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* White Dollar Sign ($) - Right Lens */}
        <g transform="translate(108, 97) scale(0.55)">
          <rect x="11" y="2" width="2" height="20" rx="1" fill="#FFFFFF" />
          <path
            d="M 17 7 
               C 17 4.8, 14.5 3.5, 12 3.5 
               C 8.5 3.5, 6.5 5.2, 6.5 7.5 
               C 6.5 10.5, 17.5 9.5, 17.5 13.5 
               C 17.5 16, 14.5 17.5, 12 17.5 
               C 9 17.5, 7 16, 7 14"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Nose (Deep Blue #003B72) */}
        <path
          d="M 114 113
             C 114 110, 117 108, 121 108
             C 125 108, 128 110, 128 113
             C 128 117, 123 121, 121 121
             C 119 121, 114 117, 114 113 Z"
          fill="#003B72"
        />

        {/* Smiling Mouth Line & Cheek Curl (Deep Blue #003B72) */}
        <path
          d="M 94 116
             C 96 122, 102 126, 108 126
             C 112 126, 116 123, 118 119"
          stroke="#003B72"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 92 113
             C 93 114, 94 116, 94 118"
          stroke="#003B72"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
