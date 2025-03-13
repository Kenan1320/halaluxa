
import React from 'react';
import LiveDeliveryDashboard from '@/components/dashboard/LiveDeliveryDashboard';
import { Helmet } from 'react-helmet';

const LiveDeliveryDashboardPage = () => {
  return (
    <>
      <Helmet>
        <title>Live Delivery Dashboard | Halvi</title>
      </Helmet>
      <LiveDeliveryDashboard />
    </>
  );
};

export default LiveDeliveryDashboardPage;
