import React from "react";
import PageContainer from "./PageContainer"; // adjust path accordingly

const AdminAnalytics = () => {
  return (
    <PageContainer
      title="Analytics"
      alert={{
        type: "info",
        message: "Analytics feature coming soon with the next backend update.",
        onClose: null, // or add a handler
      }}
    >
      <div className="grid lg:grid-cols-12 lg:grid-rows-7  gap-10 ">
        <div className="bento-tile lg:col-span-3 lg:row-span-3 lg:col-start-10 lg:row-start-1">13</div>
        <div className="bento-tile lg:col-span-9 lg:row-span-5 lg:col-start-1 lg:row-start-3">19</div>
        <div className="bento-tile lg:col-span-2 lg:row-span-2 lg:col-start-1 lg:row-start-1">20</div>
        <div className="bento-tile lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-1">22</div>
        <div className="bento-tile lg:col-span-3 lg:row-span-4 lg:col-start-10 lg:row-start-4">26</div>
        <div className="bento-tile lg:col-span-3 lg:col-start-7 lg:row-start-1">29</div>
        <div className="bento-tile lg:col-span-3 lg:col-start-7 lg:row-start-2">30</div>
        <div className="bento-tile lg:col-span-2 lg:row-span-2 lg:col-start-5 lg:row-start-1">31</div>
      </div>
    </PageContainer>
  );
};

export default AdminAnalytics;
