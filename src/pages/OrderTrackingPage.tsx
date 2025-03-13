
import React from 'react';
import OrderTracking from '@/components/order/OrderTracking';
import { Helmet } from 'react-helmet';

const OrderTrackingPage = () => {
  return (
    <>
      <Helmet>
        <title>Track Your Order | Halvi</title>
      </Helmet>
      <OrderTracking />
    </>
  );
};

export default OrderTrackingPage;
