import {FaWhatsapp} from "react-icons/fa"
import { WHATSAPP_LINK, DEFAULT_INQUIRY_TEXT } from "@/lib/constants";

export default function FloatingWhatsApp() {
  const whatsappLink = WHATSAPP_LINK(DEFAULT_INQUIRY_TEXT);

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)] hover:-translate-y-1 transition-all duration-300 group flex items-center justify-center cursor-pointer"
      aria-label="Chat with us on WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6 sm:w-8 sm:h-8"/>
      {/* Tooltip visible on desktop hover */}
      <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block border border-gray-700">
        Chat with a Stylist!
        {/* Little triangle arrow */}
        <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-[6px] border-transparent border-l-gray-900"></span>
      </span>
    </a>
  );
}
