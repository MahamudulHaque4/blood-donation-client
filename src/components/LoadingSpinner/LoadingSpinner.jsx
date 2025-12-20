// import React from "react";

// /**
//  * Modern unique loader:
//  * - Animated blob + orbiting dots + shimmer label
//  * - Works on light/dark backgrounds
//  * - Optional fullScreen overlay
//  *
//  * Usage:
//  * <LoadingSpinner />
//  * <LoadingSpinner fullScreen label="Loading cars..." />
//  * <LoadingSpinner size={90} />
//  */

// export default function LoadingSpinner({
//   label = "Loading...",
//   fullScreen = false,
//   size = 84,
//   className = "",
// }) {
//   const Wrapper = ({ children }) =>
//     fullScreen ? (
//       <div className="fixed inset-0 z-[9999] grid place-items-center bg-base-100/70 backdrop-blur-md">
//         {children}
//       </div>
//     ) : (
//       <div className={`grid place-items-center ${className}`}>{children}</div>
//     );

//   return (
//     <Wrapper>
//       <div className="flex flex-col items-center gap-3">
//         <div
//           className="relative"
//           style={{ width: size, height: size }}
//           aria-label={label}
//           role="status"
//         >
//           {/* Soft glow */}
//           <div className="absolute inset-0 rounded-full blur-xl opacity-40 animate-pulse bg-gradient-to-r from-primary via-secondary to-accent" />

//           {/* Morphing blob */}
//           <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/80 animate-blobSpin" />

//           {/* Orbit ring */}
//           <div className="absolute inset-[4%] rounded-full border border-base-content/10" />

//           {/* Orbiting dots */}
//           <div className="absolute inset-0 animate-orbit">
//             <span className="absolute top-[6%] left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-primary shadow" />
//             <span className="absolute bottom-[6%] left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-secondary shadow" />
//             <span className="absolute left-[6%] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-accent shadow" />
//           </div>

//           {/* Center dot */}
//           <div className="absolute inset-0 grid place-items-center">
//             <div className="h-2 w-2 rounded-full bg-base-content/60" />
//           </div>
//         </div>

//         {/* Shimmer text */}
//         <div className="relative text-sm font-medium tracking-wide text-base-content/80">
//           <span className="opacity-70">{label}</span>
//           <span className="absolute inset-0 bg-gradient-to-r from-transparent via-base-content/40 to-transparent bg-[length:220%_100%] animate-shimmerText [mask-image:linear-gradient(#000,transparent,#000)]" />
//         </div>
//       </div>

//       {/* Local CSS (no extra files needed) */}
//       <style>
//         {`
//           @keyframes orbit {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//           @keyframes blobSpin {
//             0% { transform: rotate(0deg); border-radius: 40% 60% 55% 45% / 45% 40% 60% 55%; }
//             50% { transform: rotate(180deg); border-radius: 60% 40% 45% 55% / 55% 60% 40% 45%; }
//             100% { transform: rotate(360deg); border-radius: 40% 60% 55% 45% / 45% 40% 60% 55%; }
//           }
//           @keyframes shimmerText {
//             0% { background-position: 220% 0; }
//             100% { background-position: -220% 0; }
//           }
//           .animate-orbit { animation: orbit 1.15s linear infinite; }
//           .animate-blobSpin { animation: blobSpin 1.35s ease-in-out infinite; }
//           .animate-shimmerText { animation: shimmerText 1.2s ease-in-out infinite; }
//         `}
//       </style>
//     </Wrapper>
//   );
// }



import React from "react";

export default function LoadingSpinner({
  label = "Loading...",
  fullScreen = false,
  size = 40,
  className = "",
}) {
  const Wrapper = ({ children }) =>
    fullScreen ? (
      <div className="fixed inset-0 z-[9999] grid place-items-center bg-base-100/60 backdrop-blur-sm">
        {children}
      </div>
    ) : (
      <div className={`grid place-items-center ${className}`}>{children}</div>
    );

  const thickness = Math.max(3, Math.round(size / 10));

  return (
    <Wrapper>
      <div
        className="flex flex-col items-center gap-3"
        role="status"
        aria-live="polite"
      >
        {/* Spinner ring */}
        <div
          className="animate-spin rounded-full border-base-content/20 border-t-primary"
          style={{
            width: size,
            height: size,
            borderWidth: thickness,
          }}
          aria-label={label}
        />

        {/* Label */}
        {label ? (
          <p className="text-sm text-base-content/70 font-medium">
            {label}
          </p>
        ) : null}
      </div>
    </Wrapper>
  );
}

