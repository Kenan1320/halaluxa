
import { Users } from 'lucide-react';

const CustomersPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-haluna-text">Customers</h1>
        <p className="text-haluna-text-light">View and manage your customers</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Users className="h-12 w-12 text-haluna-text-light mx-auto mb-4" />
        <h3 className="text-lg font-medium">Customers Coming Soon</h3>
        <p className="text-haluna-text-light mt-2 max-w-md mx-auto">
          This section is under development. Soon you'll be able to view and manage your customer base from here.
        </p>
      </div>
    </div>
  );
};

export default CustomersPage;
