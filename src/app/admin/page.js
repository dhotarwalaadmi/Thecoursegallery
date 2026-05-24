'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, pendingOrders: 0, totalOrders: 0, revenue: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/orders'),
      ]);
      const products = await productsRes.json();
      const orders = await ordersRes.json();

      const productCount = Array.isArray(products) ? products.length : 0;
      const orderList = Array.isArray(orders) ? orders : [];
      const pendingCount = orderList.filter(o => o.status === 'pending').length;
      const approvedOrders = orderList.filter(o => o.status === 'approved');
      const revenue = approvedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      setStats({
        products: productCount,
        pendingOrders: pendingCount,
        totalOrders: orderList.length,
        revenue,
      });
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  };

  return (
    <>
      <h1>Dashboard</h1>
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-value">{stats.products}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <div className="stat-value" style={{ color: '#856404' }}>{stats.pendingOrders}</div>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-value">{stats.totalOrders}</div>
        </div>
        <div className="stat-card">
          <h3>Revenue (Approved)</h3>
          <div className="stat-value" style={{ color: '#155724' }}>₹{stats.revenue.toLocaleString()}</div>
        </div>
      </div>
    </>
  );
}
