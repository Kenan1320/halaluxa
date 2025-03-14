
import { ShoppingBag, Award, Users, CreditCard } from 'lucide-react';

const features = [
  {
    icon: <ShoppingBag className="w-10 h-10 text-white" />,
    title: "Curated Halal Products",
    description: "Discover a wide range of halal-certified products across multiple categories, carefully curated for quality and authenticity."
  },
  {
    icon: <Award className="w-10 h-10 text-white" />,
    title: "Verified Halal Certification",
    description: "Every business on our platform undergoes a thorough verification process to ensure authentic halal certification."
  },
  {
    icon: <Users className="w-10 h-10 text-white" />,
    title: "Support Muslim Businesses",
    description: "Every purchase directly supports Muslim entrepreneurs and artisans, helping our community thrive and grow."
  },
  {
    icon: <CreditCard className="w-10 h-10 text-white" />,
    title: "Secure & Easy Payments",
    description: "Enjoy a seamless shopping experience with multiple secure payment options and buyer protection."
  }
];

const Features = () => {
  return (
    <section className="py-20 deep-night-blue-gradient text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Why Choose Haluna?</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Our marketplace is built on trust, quality, and authentic halal values to provide you with the best shopping experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 animate-slide-in-bottom"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-5 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-white mb-3 text-center">{feature.title}</h3>
              <p className="text-white/80 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
