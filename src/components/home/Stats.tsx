
const Stats = () => {
  return (
    <section className="py-16 deep-night-blue-gradient text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="animate-fade-in">
            <p className="text-5xl font-serif font-bold mb-2">250<span className="text-white/80">+</span></p>
            <p className="text-xl">Muslim Sellers</p>
          </div>
          
          <div className="animate-fade-in animate-delay-200">
            <p className="text-5xl font-serif font-bold mb-2">2,500<span className="text-white/80">+</span></p>
            <p className="text-xl">Halal Products</p>
          </div>
          
          <div className="animate-fade-in animate-delay-400">
            <p className="text-5xl font-serif font-bold mb-2">10,000<span className="text-white/80">+</span></p>
            <p className="text-xl">Happy Customers</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
