import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppCTA() {
  const whatsappLink =
    "https://wa.me/2349027458696?text=Hello%20AuraByDassy!%20I'm%20ready%20to%20order.";

  return (
    <section className="my-6 sm:my-10 mx-4 xl:mx-auto xl:max-w-[1500px]">
      <div className="relative bg-[#0a0a0a] overflow-hidden px-6 sm:px-16 py-16 sm:py-24">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Right-side glow */}
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Eyebrow */}
          <p className="text-[10px] font-bold text-gray-500 tracking-[0.3em] uppercase mb-6">
            Ready to Shop?
          </p>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5">
            Let's Get You
            <br />
            <span className="text-[#25D366]">Styled.</span>
          </h2>

          {/* Body */}
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-10 max-w-md mx-auto">
            Chat with our styling experts on WhatsApp. We'll help you find the perfect piece and dispatch it fast.
          </p>

          {/* CTA */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white text-sm font-bold uppercase tracking-[0.18em] hover:bg-[#1ebd5a] active:scale-95 transition-all duration-200 shadow-[0_0_40px_rgba(37,211,102,0.25)] whitespace-nowrap"
          >
            <FaWhatsapp className="w-5 h-5 flex-shrink-0" />
            Chat with us on WhatsApp
          </a>

          {/* Trust micro-copy */}
          <p className="text-gray-600 text-[11px] mt-5 tracking-wider uppercase">
            Fast response · Secure ordering · Nationwide delivery
          </p>
        </div>
      </div>
    </section>
  );
}
