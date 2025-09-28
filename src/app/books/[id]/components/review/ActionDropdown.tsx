import ActionMenu from "@/components/common/ActionMenu";
import { useClickOutside } from "@/hooks/common/useClickOutside";
import Image from "next/image";

export default function ActionDropdown({
  showDeleteModal
}: {
  showDeleteModal: () => void;
}) {
  const { open: showDropdown, setOpen, dropdownRef } = useClickOutside();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="min-w-6 pt-1"
        onClick={() => setOpen(prev => !prev)}
      >
        <Image
          src="/images/icon/ic_more.svg"
          alt="더보기"
          width={24}
          height={24}
        />
      </button>
      {showDropdown && (
        <ActionMenu onEdit={showDeleteModal} onDelete={showDeleteModal} />
      )}
    </div>
  );
}
