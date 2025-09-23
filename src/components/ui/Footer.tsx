interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`py-[24px] px-4 flex justify-between items-center max-w-[1200px] mx-auto ${className}`}>
      <div className="text-body2 font-medium text-gray-400">
        © 2025 덕후감. All Rights Reserved
      </div>
      <div className="text-body2 font-medium text-gray-400">
        Terms of service · Privacy policy
      </div>
    </footer>
  );
}
