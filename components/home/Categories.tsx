import Link from "next/link";

export default function Categories() {
  const categories = [
    { name: "Men", href: "/shop?category=Men", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=600" },
    { name: "Women", href: "/shop?category=Women", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600" },
    { name: "Shoes", href: "/shop?category=Shoes", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600" },
    { name: "Accessories", href: "/shop?category=Accessories", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=600" },
    { name: "Perfumes", href: "/shop?category=Perfumes", image: "https://images.unsplash.com/photo-1590156156158-9a3b2b80a793?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shop by Category</h2>
            <p className="mt-2 text-gray-500">Find exactly what you are looking for.</p>
          </div>
          <Link href="/shop" className="hidden md:inline-flex text-black font-semibold hover:text-gray-700 transition-colors items-center">
            View All Categories
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              href={category.href}
              className="group relative h-48 sm:h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-200 block cursor-pointer"
            >
             
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 sm:p-5">
                <span className="text-white font-bold text-lg tracking-wide group-hover:-translate-y-1 transition-transform duration-300">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 md:hidden">
          <Link href="/shop" className="inline-flex w-full items-center justify-center text-white font-semibold bg-black py-3 rounded-md hover:bg-gray-800 transition-colors">
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
