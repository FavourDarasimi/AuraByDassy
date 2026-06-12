export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Browse Products",
      description:
        "Explore our premium collection of top-tier fashion and accessories perfectly curated for you.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Tap "Order on WhatsApp"',
      description:
        "Found what you love? Simply tap the WhatsApp button on any product to start your order instantly.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Confirm & Get Delivered",
      description:
        "Our team finalises your order and arranges fast delivery straight to your doorstep.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#f9f9f9] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.25em] uppercase mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            How to Order
          </h2>
          <div className="w-10 h-[3px] bg-gray-900 mx-auto mt-4" />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200 border border-gray-200">
          {steps.map((step) => (
            <div
              key={step.id}
              className="relative flex flex-col items-center text-center px-8 py-12 group hover:bg-gray-900 transition-colors duration-300"
            >
              {/* Step number */}
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-300 group-hover:text-gray-500 mb-6 transition-colors">
                0{step.id}
              </span>

              {/* Icon container */}
              <div className="w-12 h-12 flex items-center justify-center bg-gray-900 text-white group-hover:bg-white group-hover:text-gray-900 mb-6 transition-all duration-300 flex-shrink-0">
                {step.icon}
              </div>

              {/* Text */}
              <h3 className="text-base font-bold text-gray-900 group-hover:text-white mb-3 tracking-tight transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-300 leading-relaxed transition-colors duration-300 max-w-[260px] px-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
