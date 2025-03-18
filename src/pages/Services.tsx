
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { 
  Home, 
  Grid3X3, 
  Clock, 
  User, 
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
          ? "bg-gradient-to-br from-[#2A3132] to-[#232A2B] shadow-lg border border-gray-700/30"
          : "bg-gradient-to-br from-white to-gray-50 shadow-sm border border-gray-200/50",
      )}
    >
      {promo && (
        <div className="absolute top-1.5 right-1.5 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
          Promo
        </div>
      )}
      <div className={cn("mb-2 p-2 rounded-full", isDark ? "bg-gray-800/50" : "bg-gray-100/80")}>{icon}</div>
      <p className="text-center text-sm font-medium">{title}</p>
      {comingSoon && (
        <span
          className={cn(
            "text-[10px] mt-1 px-1.5 py-0.5 rounded-full",
            isDark ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700",
          )}
        >
          Coming Soon
        </span>
      )}
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        active
          ? "text-green-500 font-medium"
          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors",
      )}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
      {active && <div className="h-1 w-1 rounded-full bg-green-500 mt-1"></div>}
    </div>
  );
}

const ServicesPage = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <div className={cn("min-h-screen pb-20", isDark ? "bg-[#1C2526] text-white" : "bg-[#F8F8F8] text-[#1C1C1C]")}>
      <header className="sticky top-0 z-10 px-6 py-4 backdrop-blur-md bg-opacity-90 border-b border-gray-800/10 dark:border-gray-100/10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">Halvi Services</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Go Anywhere Section */}
        <section className="mb-8 animate-fade-in">
          <h2 className="text-xl font-bold mb-4 tracking-tight">Go anywhere</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <ServiceCard icon={<Car className="h-6 w-6" />} title="Halvi Rides" comingSoon />
            <ServiceCard icon={<Utensils className="h-6 w-6" />} title="Halvi Eats" comingSoon promo />
            <ServiceCard icon={<Car className="h-6 w-6" />} title="Car Rentals" comingSoon promo />
            <ServiceCard icon={<Ticket className="h-6 w-6" />} title="Event Tickets" comingSoon />
          </div>
        </section>

        {/* Get Anything Delivered Section */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-bold mb-4 tracking-tight">Get anything delivered</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <ServiceCard icon={<ShoppingBag className="h-6 w-6" />} title="Groceries" comingSoon promo />
            <ServiceCard icon={<Package className="h-6 w-6" />} title="Essentials" promo />
            <ServiceCard icon={<Briefcase className="h-6 w-6" />} title="Business" comingSoon />
          </div>
        </section>

        {/* Book Experts & Professionals Section */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold mb-4 tracking-tight">Book Experts & Professionals</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <ServiceCard icon={<GraduationCap className="h-6 w-6" />} title="Halvi Tutors" comingSoon />
            <ServiceCard icon={<BookOpen className="h-6 w-6" />} title="Enroll with Teachers" comingSoon />
            <ServiceCard icon={<HeartPulse className="h-6 w-6" />} title="Book a Therapist" comingSoon />
          </div>
        </section>

        {/* More Services Section */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xl font-bold mb-4 tracking-tight">More Services</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <ServiceCard icon={<Wrench className="h-6 w-6" />} title="Home Services" comingSoon />
            <ServiceCard icon={<Scissors className="h-6 w-6" />} title="Wellness" comingSoon />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServicesPage;
