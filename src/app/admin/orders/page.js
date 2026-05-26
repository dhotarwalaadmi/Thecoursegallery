'use client';
import { useState, useEffect } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch('/api/admin/orders');
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  const updateStatus = async (orderId, status) => {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) fetchOrders();
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <>
      <h1>Order Management</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            className="category-tab"
            style={filter === f ? { background: '#0b2de6', color: 'white', borderColor: '#0b2de6' } : {}}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Billing Name</th>
            <th>Email</th>
            <th>Bank Holder</th>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <>
              <tr key={order.id} onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} style={{ cursor: 'pointer' }}>
                <td style={{ fontSize: '11px' }}>#{order.id.slice(-8).toUpperCase()}</td>
                <td>
                  <div style={{ fontWeight: '600' }}>{order.user?.name || order.payerName || 'Guest'}</div>
                  <div style={{ fontSize: '11px', color: '#999' }}>{order.user?.email || order.email || 'No email'}</div>
                  <div style={{ fontSize: '11px', color: '#0b2de6', marginTop: '4px', background: '#eef2ff', padding: '3px 6px', borderRadius: '4px', display: 'inline-block', fontWeight: '500', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={order.items?.map(i => i.product?.title).join(', ')}>
                    📦 {order.items?.map(i => i.product?.title).join(', ') || 'No products'}
                  </div>
                </td>
                <td style={{ fontWeight: '600' }}>{order.payerName}</td>
                <td style={{ fontSize: '12px' }}>
                  {order.email ? (
                    <a href={`mailto:${order.email}`} style={{ color: '#0b2de6' }}>{order.email}</a>
                  ) : '—'}
                </td>
                <td style={{ fontWeight: '500' }}>{order.bankHolderName || '—'}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{order.transactionId}</td>
                <td style={{ fontWeight: '700' }}>₹{order.totalAmount.toLocaleString()}</td>
                <td style={{ fontSize: '12px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`order-status status-${order.status}`}>{order.status}</span>
                </td>
                <td>
                  {order.status === 'pending' && (
                    <>
                      <button className="btn-admin btn-admin-approve" onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'approved'); }}>Approve</button>
                      <button className="btn-admin btn-admin-reject" onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'rejected'); }}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
              {expandedOrder === order.id && (
                <tr key={`${order.id}-details`}>
                  <td colSpan={10} style={{ background: '#f9f9ff', padding: '15px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <strong style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>Order Items:</strong>
                        <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '13px' }}>
                          {order.items?.map(i => (
                            <li key={i.id}>{i.product?.title} — ₹{i.price.toLocaleString()}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        {order.orderNotes && (
                          <>
                            <strong style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>Order Notes:</strong>
                            <p style={{ fontSize: '13px', margin: '5px 0', color: '#555' }}>{order.orderNotes}</p>
                          </>
                        )}
                        <strong style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>Bank Holder Name:</strong>
                        <p style={{ fontSize: '13px', margin: '5px 0', fontWeight: '600' }}>{order.bankHolderName || '—'}</p>
                        <strong style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>Transaction ID:</strong>
                        <p style={{ fontSize: '13px', margin: '5px 0', fontFamily: 'monospace' }}>{order.transactionId}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <h3>No orders found</h3>
          <p>No {filter !== 'all' ? filter : ''} orders to display</p>
        </div>
      )}
    </>
  );
}
