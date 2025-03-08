
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PaymentMethodList from '@/components/payment/PaymentMethodList';
import PaymentMethodForm from '@/components/payment/PaymentMethodForm';
import { PaymentMethod } from '@/models/shop';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentMethodsPage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [methodToEdit, setMethodToEdit] = useState<PaymentMethod | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleSuccess = () => {
    setShowAddForm(false);
    setMethodToEdit(null);
    setRefreshKey(prev => prev + 1);
  };
  
  const handleEdit = (method: PaymentMethod) => {
    setMethodToEdit(method);
    setShowAddForm(true);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Helmet>
        <title>Payment Methods | Haluna</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link to="/profile" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
        </div>
        
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        )}
      </div>
      
      {showAddForm ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {methodToEdit ? 'Edit Payment Method' : 'Add New Payment Method'}
          </h2>
          <PaymentMethodForm 
            existingMethod={methodToEdit || undefined} 
            onSuccess={handleSuccess} 
          />
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddForm(false);
                setMethodToEdit(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Your Payment Methods</h2>
          <PaymentMethodList 
            key={`payment-methods-${refreshKey}`}
            onEdit={handleEdit}
            onMethodsChange={() => setRefreshKey(prev => prev + 1)}
          />
        </div>
      )}
      
      <div className="mt-8 text-sm text-gray-500 p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-medium text-gray-700 mb-2">About Payment Security</h3>
        <p>
          Your payment information is securely stored and processed according to the highest security standards.
          We use encryption to protect your sensitive data and never store complete card numbers on our servers.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
