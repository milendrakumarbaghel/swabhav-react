import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import SummaryCard from "../components/SummaryCard";
import ProductList from "../components/ProductList";
import { fetchProducts, fetchCustomers, fetchPolicies } from "../services/api";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [activeTab, setActiveTab] = useState("products");

  // useEffect(() => {
  //   fetchProducts().then(setProducts);
  //   fetchCustomers().then(setCustomers);
  //   fetchPolicies().then(setPolicies);
  // }, []);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data.products || data.content || []);
    });

    // fetchCustomers().then(data => {
    //   setCustomers(data.customers || data.content || []);
    // });
    fetchCustomers().then(setCustomers);

    fetchPolicies().then(data => {
      setPolicies(data.policies || data.content || []);
    });
  }, []);

  const getActiveData = () => {
    if (activeTab === "products") return products;
    if (activeTab === "customers") return customers;
    return policies;
  };

  return (
    <div className="dashboard">
      <div className="card-container">
        <SummaryCard
          title="Products"
          count={products.length}
          active={activeTab === "products"}
          onClick={() => setActiveTab("products")}
        />
        <SummaryCard
          title="Customers"
          count={customers.length}
          active={activeTab === "customers"}
          onClick={() => setActiveTab("customers")}
        />
        <SummaryCard
          title="Policies"
          count={policies.length}
          active={activeTab === "policies"}
          onClick={() => setActiveTab("policies")}
        />
      </div>

      <ProductList items={getActiveData()} type={activeTab} />
    </div>
  );
};

export default Dashboard;
