
import React from 'react';
import { 
  Home, 
  Car, 
  Ticket, 
  Utensils, 
  ShoppingBag, 
  Package, 
  GraduationCap, 
  Briefcase, 
  Wrench, 
  Scissors, 
  HeartPulse, 
  BookOpen 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  comingSoon?: boolean;
  promo?: boolean;
}

function ServiceCard({ icon, title, comingSoon = false, promo = false }: ServiceCardProps) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  
  return (
    <div
      className={cn(
        "relative rounded-xl p-4 flex flex-col items-center justify-center aspect-square transition-all duration-200 hover:scale-105 active:scale-95",
        isDark
          ? "bg-[#232A2B] shadow-lg border border-gray-700/30"
          : "bg-white shadow-sm border border-gray-200/50",
      )}
    >
      {promo && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
          Promo
        </div>
      )}
      <div className={cn("mb-3 p-3 rounded-full", isDark ? "bg-gray-800/50" : "bg-gray-100/80")}>
        {icon}
      </div>
      <p className="text-center text-base font-medium mb-1">{title}</p>
      {comingSoon && (
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700",
          )}
        >
          Coming Soon
        </span>
      )}
    </div>
  );
}

const ServicesPage = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <div className={cn("min-h-screen pb-24", isDark ? "bg-[#1C2526] text-white" : "bg-[#F8F8F8] text-[#1C1C1C]")}>
      <header className="sticky top-0 z-10 px-6 py-4 backdrop-blur-md bg-opacity-90 border-b border-gray-800/10 dark:border-gray-100/10">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Halvi Services
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-12">
        {/* Go Anywhere Section */}
        <section className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-5 tracking-tight">Go anywhere</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ServiceCard icon={<Car className="h-7 w-7" />} title="Halvi Rides" comingSoon />
            <ServiceCard icon={<Utensils className="h-7 w-7" />} title="Halvi Eats" comingSoon promo />
            <ServiceCard icon={<Car className="h-7 w-7" />} title="Car Rentals" comingSoon promo />
            <ServiceCard icon={<Ticket className="h-7 w-7" />} title="Event Tickets" comingSoon />
          </div>
        </section>

        {/* Get Anything Delivered Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold mb-5 tracking-tight">Get anything delivered</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ServiceCard icon={<ShoppingBag className="h-7 w-7" />} title="Groceries" comingSoon promo />
            <ServiceCard icon={<Package className="h-7 w-7" />} title="Essentials" promo />
            <ServiceCard icon={<Briefcase className="h-7 w-7" />} title="Business" comingSoon />
          </div>
        </section>

        {/* Book Experts & Professionals Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold mb-5 tracking-tight">Book Experts & Professionals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ServiceCard icon={<GraduationCap className="h-7 w-7" />} title="Halvi Tutors" comingSoon />
            <ServiceCard icon={<BookOpen className="h-7 w-7" />} title="Enroll with Teachers" comingSoon />
            <ServiceCard icon={<HeartPulse className="h-7 w-7" />} title="Book a Therapist" comingSoon />
          </div>
        </section>

        {/* More Services Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold mb-5 tracking-tight">More Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ServiceCard icon={<Wrench className="h-7 w-7" />} title="Home Services" comingSoon />
            <ServiceCard icon={<Scissors className="h-7 w-7" />} title="Wellness" comingSoon />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServicesPage;
