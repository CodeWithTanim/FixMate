"use client";

import { useState } from "react";

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function UserAvatar({
  src,
  name,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [imgError, setImgError] = useState(false);

  // Official React pattern: reset state during render when prop changes
  if (prevSrc !== src) {
    setPrevSrc(src);
    setImgError(false);
  }

  const initial = (name?.trim()?.[0] || "U").toUpperCase();

  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-11 w-11 text-base",
  };

  if (src && !imgError) {
    return (
      <div
        className={`relative overflow-hidden rounded-full border border-[#DCE5DF] bg-white shrink-0 ${sizeClasses[size]} ${className}`}
      >
        <img
          src={src}
          alt={name ? `${name}'s profile avatar` : "User profile avatar"}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[#18756B] text-white font-bold uppercase select-none shrink-0 ${sizeClasses[size]} ${className}`}
      aria-label={name ? `${name}'s profile avatar` : "User avatar"}
    >
      {initial}
    </div>
  );
}
