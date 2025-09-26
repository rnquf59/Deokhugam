interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`bg-gray-50 ${className}`}>
      <div className="py-[24px] px-4 flex justify-between items-center max-w-[1200px] mx-auto">
        <div className="text-body2 font-medium text-gray-400">
          © 2025 덕후감. All Rights Reserved
        </div>
        <div className="text-body2 font-medium text-gray-400">
          Terms of service · Privacy policy
        </div>
      </div>
    </footer>
  );
}
