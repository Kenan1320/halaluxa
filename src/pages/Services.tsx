
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
        "relative rounded-xl p-3 flex flex-col items-center justify-center aspect-square transition-all duration-200 hover:scale-105 active:scale-95",
        isDark
          ? "bg-[#0F1B44] shadow-lg border border-gray-700/30"
          : "bg-white shadow-sm border border-gray-200/50",
      )}
    >
      {promo && (
        <div className="absolute top-1.5 right-1.5 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
          Promo
        </div>
      )}
      <div className={cn("mb-2 p-2 rounded-full", isDark ? "bg-[#132054]/50" : "bg-gray-100/80")}>
        {icon}
      </div>
      <p className="text-center text-xs font-medium mb-1">{title}</p>
      {comingSoon && (
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-full",
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
    <div className={cn("min-h-screen pb-20", isDark ? "bg-[#0F1B44] text-white" : "bg-[#F8F8F8] text-[#1C1C1C]")}>
      <header className="sticky top-0 z-10 px-6 py-3 backdrop-blur-md bg-opacity-90 border-b border-gray-800/10 dark:border-gray-100/10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Halvi Services</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 space-y-6">
        {/* Go Anywhere Section */}
        <section className="animate-fade-in">
          <h2 className="text-lg font-bold mb-3 tracking-tight">Go anywhere</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <ServiceCard icon={<Car className="h-5 w-5" />} title="Halvi Rides" comingSoon />
            <ServiceCard icon={<Utensils className="h-5 w-5" />} title="Halvi Eats" comingSoon promo />
            <ServiceCard icon={<Car className="h-5 w-5" />} title="Car Rentals" comingSoon promo />
            <ServiceCard icon={<Ticket className="h-5 w-5" />} title="Event Tickets" comingSoon />
          </div>
        </section>

        {/* Get Anything Delivered Section */}
        <section className="animate-fade-in">
          <h2 className="text-lg font-bold mb-3 tracking-tight">Get anything delivered</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <ServiceCard icon={<ShoppingBag className="h-5 w-5" />} title="Groceries" comingSoon promo />
            <ServiceCard icon={<Package className="h-5 w-5" />} title="Essentials" promo />
            <ServiceCard icon={<Briefcase className="h-5 w-5" />} title="Business" comingSoon />
          </div>
        </section>

        {/* Book Experts Section */}
        <section className="animate-fade-in">
          <h2 className="text-lg font-bold mb-3 tracking-tight">Book Experts</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <ServiceCard icon={<GraduationCap className="h-5 w-5" />} title="Halvi Tutors" comingSoon />
            <ServiceCard icon={<BookOpen className="h-5 w-5" />} title="Teachers" comingSoon />
            <ServiceCard icon={<HeartPulse className="h-5 w-5" />} title="Therapist" comingSoon />
          </div>
        </section>

        {/* More Services Section */}
        <section className="animate-fade-in">
          <h2 className="text-lg font-bold mb-3 tracking-tight">More Services</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <ServiceCard icon={<Wrench className="h-5 w-5" />} title="Home Services" comingSoon />
            <ServiceCard icon={<Scissors className="h-5 w-5" />} title="Wellness" comingSoon />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServicesPage;
