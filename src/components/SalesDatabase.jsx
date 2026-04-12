/* eslint-disable */
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const SalesDatabase = ({ rmId, rmName, onClose }) => {
  const [sales, setSales] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSales();
  }, [rmId]);

  const loadSales = async () => {
    setLoading(true);
    try {
      let query = supabase.from('sales').select('*');
      if (rmId !== 'all') {
        query = query.eq('rm_id', rmId);
      }
      const { data, error } = await query.order('date', { ascending: false });
      if (error) throw error;
      setSales(data || []);
      const total = (data || []).reduce((sum, sale) => sum + (sale.amount || 0), 0);
      setTotalAmount(total);
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const filteredSales = sales.filter(sale => {
    if (filterStatus !== 'all' && sale.status !== filterStatus) return false;
    if (dateRange.start && sale.date < dateRange.start) return false;
    if (dateRange.end && sale.date > dateRange.end) return false;
    return true;
  });

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>💰 Sales Database {rmName ? `- ${rmName}` : ''}</h2>
        <button onClick={onClose} style={{ background: '#dc3545', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Close</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div style={{ background: '#28a745', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{sales.length}</div>
          <div>Total Sales</div>
        </div>
        <div style={{ background: '#28a745', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{formatRupees(totalAmount)}</div>
          <div>Total Revenue</div>
        </div>
        <div style={{ background: '#28a745', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{sales.filter(s => s.status === 'completed').length}</div>
          <div>Completed</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
        <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              {rmId === 'all' && <th style={{ border: '1px solid #ddd', padding: '12px' }}>RM Name</th>}
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>CP Name</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Amount</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Date</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Payment Mode</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map(sale => (
              <tr key={sale.id}>
                {rmId === 'all' && <td style={{ border: '1px solid #ddd', padding: '10px' }}>{sale.rm_id || '-'}</td>}
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{sale.cp_name || sale.cpName || '-'}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{formatRupees(sale.amount)}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{sale.date}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{sale.payment_mode || sale.paymentMode || '-'}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    background: sale.status === 'completed' ? '#d4edda' : '#fff3cd',
                    color: sale.status === 'completed' ? '#155724' : '#856404'
                  }}>
                    {sale.status || 'pending'}
                  </span>
                </td>
              </tr>
            ))}
            {filteredSales.length === 0 && (
              <tr>
                <td colSpan={rmId === 'all' ? 6 : 5} style={{ textAlign: 'center', padding: '40px' }}>No sales records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDatabase;