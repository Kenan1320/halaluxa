
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, CheckCircle, ShieldCheck, Globe } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck className="w-12 h-12 text-haluna-primary" />,
    title: "Showcase Your Halal Certification",
    description: "Display your halal certifications prominently to build trust with customers who value halal authenticity."
  },
  {
    icon: <Globe className="w-12 h-12 text-haluna-primary" />,
    title: "Reach a Global Audience",
    description: "Access a community of Muslim shoppers from around the world looking specifically for halal products."
  },
  {
    icon: <Briefcase className="w-12 h-12 text-haluna-primary" />,
    title: "Easy Business Management",
    description: "Use our intuitive seller dashboard to manage products, track orders, and grow your business."
  }
];

const Sellers = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Grow Your Business with Haluna</h1>
            <p className="text-haluna-text-light text-lg mb-8">
              Join our growing marketplace of Muslim businesses and reach thousands of customers looking for halal products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/dashboard" size="lg">
                Access Seller Dashboard
              </Button>
              <Button href="#benefits" variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Features Section */}
          <section id="benefits" className="py-16 bg-haluna-secondary rounded-2xl mb-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif font-bold mb-4">Why Sell on Haluna?</h2>
                <p className="text-haluna-text-light max-w-2xl mx-auto">
                  Our platform provides everything you need to grow your halal business online.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                    <div className="bg-haluna-primary-light rounded-full w-20 h-20 flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                    <p className="text-haluna-text-light">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* How It Works Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">How It Works</h2>
              <p className="text-haluna-text-light max-w-2xl mx-auto">
                Getting started as a seller on Haluna is simple and straightforward.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Sign Up",
                  description: "Create your seller account and verify your business information."
                },
                {
                  step: "2",
                  title: "Set Up Your Store",
                  description: "Customize your storefront with your brand elements and halal certifications."
                },
                {
                  step: "3",
                  title: "Add Products",
                  description: "List your products with detailed descriptions and high-quality images."
                },
                {
                  step: "4",
                  title: "Start Selling",
                  description: "Receive orders, fulfill them, and grow your customer base."
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-haluna-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-4">
                    {item.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-5 left-12 w-full h-0.5 bg-haluna-primary-light"></div>
                  )}
                  <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                  <p className="text-haluna-text-light">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button href="/dashboard" size="lg">
                Get Started Now <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </section>
          
          {/* Testimonials Section */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif font-bold mb-4">Success Stories</h2>
                <p className="text-haluna-text-light max-w-2xl mx-auto">
                  Hear from businesses that have grown with Haluna.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    quote: "Joining Haluna has transformed our business. We've reached customers across the country who specifically look for halal-certified products.",
                    name: "Sarah Ahmed",
                    business: "Modest Fashion Boutique"
                  },
                  {
                    quote: "The seller dashboard makes it so easy to manage our products and orders. Our sales have increased 200% since joining the platform.",
                    name: "Omar Khan",
                    business: "Halal Treats Bakery"
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-haluna-secondary p-6 rounded-xl">
                    <p className="text-haluna-text italic mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-haluna-primary text-white rounded-full flex items-center justify-center font-medium text-lg mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-haluna-text-light">{testimonial.business}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* FAQ Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-haluna-text-light max-w-2xl mx-auto">
                Get answers to common questions about selling on Haluna.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "What are the fees for selling on Haluna?",
                  answer: "Haluna charges a small commission on each sale, typically 5-10% depending on the product category. There are no monthly fees or listing fees."
                },
                {
                  question: "How do I verify my halal certification?",
                  answer: "During the seller verification process, you'll be asked to upload your halal certifications. Our team will review and verify them before your store goes live."
                },
                {
                  question: "How quickly will I receive payments?",
                  answer: "Payments are processed every two weeks, with funds typically arriving in your account within 3-5 business days after processing."
                },
                {
                  question: "Can I sell internationally?",
                  answer: "Yes! Haluna allows you to sell globally. You can specify which countries you ship to in your seller settings."
                },
              ].map((faq, index) => (
                <div key={index} className="border rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-haluna-text-light">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="bg-haluna-primary rounded-2xl text-white p-8 md:p-12 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Ready to Start Selling?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Join thousands of Muslim businesses already growing with Haluna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/dashboard" size="lg" variant="secondary">
                Access Seller Dashboard
              </Button>
              <Button href="#" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-haluna-primary">
                Contact Sales Team
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-white" />
                <span className="text-sm opacity-90">No monthly fees</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-white" />
                <span className="text-sm opacity-90">Easy setup</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-white" />
                <span className="text-sm opacity-90">24/7 support</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-white" />
                <span className="text-sm opacity-90">Secure payments</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sellers;
