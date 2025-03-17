
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminShops from '@/components/admin/AdminShops';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminSettings from '@/components/admin/AdminSettings';

const AdminDashboard = () => {
  const { mode } = useTheme();
  const [currentSection, setCurrentSection] = useState('overview');

  const renderSection = () => {
    switch (currentSection) {
      case 'overview':
        return <AdminOverview />;
      case 'shops':
        return <AdminShops />;
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'users':
        return <AdminUsers />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className={`min-h-screen flex ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <AdminSidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
