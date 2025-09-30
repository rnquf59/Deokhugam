import React from "react";
import Image from "next/image";

interface StarRatingProps {
  rating: number;
  children?: React.ReactNode;
  className?: string;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  children,
  className = "",
  size = 18
}) => {
  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starIndex = index + 1;

      if (starIndex <= Math.floor(rating)) {
        return (
          <Image
            key={index}
            src="/images/icon/ic_star.svg"
            alt="별점"
            width={size}
            height={size}
          />
        );
      } else if (starIndex === Math.ceil(rating) && rating % 1 >= 0.5) {
        return (
          <Image
            key={index}
            src="/images/icon/ic_star_half.svg"
            alt="반별점"
            width={size}
            height={size}
          />
        );
      } else {
        return (
          <Image
            key={index}
            src="/images/icon/ic_star_failled.svg"
            alt="빈별점"
            width={size}
            height={size}
          />
        );
      }
    });
  };

  return (
    <div className={`flex items-center gap-[4px] ${className}`}>
      <div className="flex">{renderStars()}</div>
      {children}
    </div>
  );
};

export default StarRating;
