import React from "react";
import BillingHistory from "../components/BillingHistory";
import PaymentMethods from "../components/PaymentMethods";
import SubscriptionPlans from "../components/SubscriptionPlans";
import Navbar from "../../../components/header";

const BillingSubscription = () => {
  return (
    <>
      <Navbar />
      <div className='p-6 space-y-6'>
        <SubscriptionPlans />
        <PaymentMethods />
        <BillingHistory />
      </div>
    </>
  );
};

export default BillingSubscription;
