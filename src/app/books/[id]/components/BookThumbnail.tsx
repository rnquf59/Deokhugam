import Image from "next/image";

export default function BookThumbnail() {
  return (
    <div className="relative min-w-[400px] min-h-[600px] max-h-[600px] w-[calc(100vw_*_(400/1920)) h-[calc(100vh_*_(600/1344))]] border rounded-xl overflow-hidden">
      <Image src="/images/books/imgError.png" alt="Thumbnail" fill />
    </div>
  );
}
