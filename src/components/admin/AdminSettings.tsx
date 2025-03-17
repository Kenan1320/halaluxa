
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from 'lucide-react';

const AdminSettings = () => {
  const { mode } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'commissions', label: 'Commissions' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
  ];
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Settings</h1>
      
      <div className={`border-b ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? mode === 'dark'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-blue-600 text-blue-600'
                  : mode === 'dark'
                    ? 'border-transparent text-gray-400 hover:text-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl border ${
            mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className="text-xl font-bold mb-4">Platform Information</h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Platform Name
                </label>
                <input
                  type="text"
                  value="Halvi"
                  className={`w-full p-2 rounded border ${
                    mode === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Platform Description
                </label>
                <textarea
                  rows={3}
                  value="Connecting Muslim consumers with authentic halal businesses, products, and services."
                  className={`w-full p-2 rounded border ${
                    mode === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Contact Email
                </label>
                <input
                  type="email"
                  value="support@halvi.io"
                  className={`w-full p-2 rounded border ${
                    mode === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Currency
                </label>
                <select
                  className={`w-full p-2 rounded border ${
                    mode === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-xl border ${
            mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className="text-xl font-bold mb-4">Business Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="manual-approval"
                  type="checkbox"
                  checked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="manual-approval" className="ml-2 block text-sm">
                  Require manual approval for new businesses
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="product-approval"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="product-approval" className="ml-2 block text-sm">
                  Require manual approval for new products
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="halal-certification"
                  type="checkbox"
                  checked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="halal-certification" className="ml-2 block text-sm">
                  Require halal certification documentation
                </label>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Maximum Products Per Shop
                </label>
                <input
                  type="number"
                  value="500"
                  className={`w-full p-2 rounded border ${
                    mode === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" className="flex items-center gap-2">
              <RotateCcw size={16} />
              Reset
            </Button>
            <Button className="flex items-center gap-2 bg-haluna-primary hover:bg-haluna-primary-dark">
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        </div>
      )}
      
      {activeTab === 'commissions' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl border ${
            mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className="text-xl font-bold mb-4">Commission Settings</h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Default Commission Rate (%)
                </label>
                <input
                  type="number"
                  value="5"
                  min="0"
                  max="100"
                  className={`w-full p-2 rounded border ${
                    mode === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This is the percentage Halvi takes from each transaction.
                </p>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Minimum Payout Amount ($)
                </label>
                <input
                  type="number"
                  value="50"
                  min="0"
                  className={`w-full p-2 rounded border ${
                    mode === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Payout Schedule
                </label>
                <select
                  className={`w-full p-2 rounded border ${
                    mode === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-xl border ${
            mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className="text-xl font-bold mb-4">Category Commission Rates</h2>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Set different commission rates for different product categories.
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Food & Grocery
                  </label>
                  <input
                    type="number"
                    value="4"
                    min="0"
                    max="100"
                    className={`w-full p-2 rounded border ${
                      mode === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Clothing & Fashion
                  </label>
                  <input
                    type="number"
                    value="6"
                    min="0"
                    max="100"
                    className={`w-full p-2 rounded border ${
                      mode === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Books & Education
                  </label>
                  <input
                    type="number"
                    value="5"
                    min="0"
                    max="100"
                    className={`w-full p-2 rounded border ${
                      mode === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    mode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Home & Decor
                  </label>
                  <input
                    type="number"
                    value="7"
                    min="0"
                    max="100"
                    className={`w-full p-2 rounded border ${
                      mode === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" className="flex items-center gap-2">
              <RotateCcw size={16} />
              Reset
            </Button>
            <Button className="flex items-center gap-2 bg-haluna-primary hover:bg-haluna-primary-dark">
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        </div>
      )}
      
      {activeTab !== 'general' && activeTab !== 'commissions' && (
        <div className={`p-6 rounded-xl border ${
          mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className="text-xl font-bold mb-4">{tabs.find(t => t.id === activeTab)?.label} Settings</h2>
          <p>These settings are not yet implemented in the admin dashboard.</p>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
