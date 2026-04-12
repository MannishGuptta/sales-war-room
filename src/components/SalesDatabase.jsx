/* eslint-disable */
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const SalesDatabase = ({ rmId, rmName, onClose }) => {
  const [sales, setSales] = useState([]);
  const [rms, setRms] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSales();
    loadRms();
  }, [rmId]);

  const loadRms = async () => {
    const { data } = await supabase.from('rms').select('id, name');
    if (data) setRms(data);
  };

  const loadSales = async () => {
    setLoading(true);
    try {
      let query = supabase.from('sales').select('*');
      
      if (rmId !== 'all') {
        query = query.eq('rm_id', rmId);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) throw error;
      
      // Add RM names to sales
      const salesWithRmNames = await Promise.all((data || []).map(async (sale) => {
        if (sale.rm_id) {
          const { data: rmData } = await supabase.from('rms').select('name').eq('id', sale.rm_id).single();
          return { ...sale, rmName: rmData?.name || 'Unknown' };
        }
        return { ...sale, rmName: rmName || 'Unknown' };
      }));
      
      setSales(salesWithRmNames);
      const total = salesWithRmNames.reduce((sum, sale) => sum + (sale.amount || 0), 0);
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const filteredSales = sales.filter(sale => {
    if (filterStatus !== 'all' && sale.status !== filterStatus) return false;
    if (dateRange.start && sale.date < dateRange.start) return false;
    if (dateRange.end && sale.date > dateRange.end) return false;
    return true;
  });

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '2px solid #f0f0f0'
    },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 },
    closeBtn: {
      background: '#dc3545', color: 'white', border: 'none',
      padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
    },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' },
    statCard: { background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' },
    filters: { display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' },
    select: { padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
    input: { padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { border: '1px solid #ddd', padding: '12px', background: '#f8f9fa', textAlign: 'left', fontWeight: 'bold', fontSize: '14px' },
    td: { border: '1px solid #ddd', padding: '10px', fontSize: '14px' },
    statusBadge: { display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    completedBadge: { background: '#d4edda', color: '#155724' },
    pendingBadge: { background: '#fff3cd', color: '#856404' },
    loadingText: { textAlign: 'center', padding: '40px', color: '#666' }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading sales data...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>💰 Sales Database {rmName ? `- ${rmName}` : ''}</h2>
        <button onClick={onClose} style={styles.closeBtn}>Close</button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{sales.length}</div>
          <div>Total Sales</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{formatRupees(totalAmount)}</div>
          <div>Total Revenue</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{sales.filter(s => s.status === 'completed').length}</div>
          <div>Completed</div>
        </div>
      </div>

      <div style={styles.filters}>
        <select style={styles.select} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        <input 
          type="date" 
          style={styles.input} 
          value={dateRange.start} 
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} 
          placeholder="Start Date"
        />
        <input 
          type="date" 
          style={styles.input} 
          value={dateRange.end} 
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} 
          placeholder="End Date"
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              {rmId === 'all' && <th style={styles.th}>RM Name</th>}
              <th style={styles.th}>CP Name</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Payment Mode</th>
              <th style={styles.th}>Invoice No</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map(sale => (
              <tr key={sale.id}>
                {rmId === 'all' && <td style={styles.td}>{sale.rmName || '-'}</td>}
                <td style={styles.td}>{sale.cp_name || sale.cpName || '-'}</td>
                <td style={styles.td}>{formatRupees(sale.amount)}</td>
                <td style={styles.td}>{sale.date}</td>
                <td style={styles.td}>{sale.payment_mode || sale.paymentMode || '-'}</td>
                <td style={styles.td}>{sale.invoice_no || sale.invoiceNo || '-'}</td>
                <td style={styles.td}>
                  <span style={{ 
                    ...styles.statusBadge, 
                    ...(sale.status === 'completed' ? styles.completedBadge : styles.pendingBadge) 
                  }}>
                    {sale.status || 'pending'}
                  </span>
                </td>
              </table>
            ))}
            {filteredSales.length === 0 && (
              <tr>
                <td colSpan={rmId === 'all' ? 7 : 6} style={{ textAlign: 'center', padding: '40px' }}>
                  No sales records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDatabase;