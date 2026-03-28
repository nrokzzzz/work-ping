import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Button, Spinner } from 'react-bootstrap';
import { useAuthContext } from '@/context/useAuthContext';
import axiosClient from '@/helpers/httpClient';

// ── Helpers ────────────────────────────────────────────────────────────────────

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// ── Sub-components ─────────────────────────────────────────────────────────────

const DetailRow = ({ label, value }) => (
  <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
    <span className="text-muted small">{label}</span>
    <span className="fw-semibold small text-end" style={{ maxWidth: '60%', wordBreak: 'break-all' }}>{value}</span>
  </div>
);

const StateConfirming = () => (
  <div className="text-center">
    <div className="position-relative d-inline-flex align-items-center justify-content-center mb-4" style={{ width: 96, height: 96 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'rgba(13,110,253,.12)',
        animation: 'pulse-ring 1.4s ease-out infinite'
      }} />
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'rgba(13,110,253,.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Spinner variant="primary" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    </div>
    <h4 className="fw-bold mb-1">Confirming Payment</h4>
    <p className="text-muted small mb-0">Please wait while we verify your transaction…</p>
    <p className="text-muted" style={{ fontSize: 11 }}>Do not close or refresh this page</p>
  </div>
);

const StateSuccess = ({ data, orderId, onDashboard }) => (
  <div className="text-center">
    <div className="d-inline-flex align-items-center justify-content-center mb-4" style={{
      width: 88, height: 88, borderRadius: '50%',
      background: 'rgba(25,135,84,.12)'
    }}>
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" stroke="#198754" strokeWidth="1.5" />
        <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#198754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="stroke-dasharray" from="0 30" to="30 0" dur=".4s" fill="freeze" />
        </path>
      </svg>
    </div>
    <h4 className="fw-bold text-success mb-1">Payment Successful!</h4>
    <p className="text-muted small mb-4">Your subscription is now active</p>

    <div className="text-start bg-light rounded p-3 mb-4" style={{ maxWidth: 400, margin: '0 auto 1.5rem' }}>
      {data?.planName   && <DetailRow label="Plan"             value={data.planName} />}
      {data?.amount     && <DetailRow label="Amount Paid"      value={fmt(data.amount)} />}
      {data?.billingCycle && <DetailRow label="Billing Cycle"  value={data.billingCycle} />}
      {data?.subscriptionEnds && <DetailRow label="Active Until" value={fmtDate(data.subscriptionEnds)} />}
      {data?.transactionId && <DetailRow label="Transaction ID" value={data.transactionId} />}
      <DetailRow label="Order ID" value={orderId} />
    </div>

    <Button variant="success" size="lg" onClick={onDashboard}>
      Go to Dashboard →
    </Button>
  </div>
);

const StateFailed = ({ data, orderId, onRetry, onDashboard }) => (
  <div className="text-center">
    <div className="d-inline-flex align-items-center justify-content-center mb-4" style={{
      width: 88, height: 88, borderRadius: '50%',
      background: 'rgba(220,53,69,.1)'
    }}>
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" stroke="#dc3545" strokeWidth="1.5" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
    <h4 className="fw-bold text-danger mb-1">Payment Failed</h4>
    <p className="text-muted small mb-4">{data?.reason || 'Something went wrong with your payment.'}</p>
    <DetailRow label="Order ID" value={orderId} />
    <div className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" onClick={onRetry}>Try Again</Button>
      <Button variant="light" onClick={onDashboard}>Go to Dashboard</Button>
    </div>
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function OrderStatus() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { userId, authLoading } = useAuthContext();

  const socketRef = useRef(null);
  const [status, setStatus] = useState('confirming'); // confirming | success | failed
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    if (authLoading || !userId) return;

    const socket = io(import.meta.env.VITE_BASE_URL?.replace(/\/$/, ''), {
      withCredentials: true,
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('payment:join', { userId });
    });

    // Initial Redis replay
    socket.on('payment:status', (data) => {
      if (data?.status === 'Success') {
        setStatus('success');
        setEventData(data);
      } else if (data?.status === 'Failed') {
        setStatus('failed');
        setEventData(data);
      }
      // 'Pending' or 'None' → stay on confirming, fallback poll below
    });

    socket.on('payment:success', (data) => {
      setStatus('success');
      setEventData(data);
    });

    socket.on('payment:failed', (data) => {
      setStatus('failed');
      setEventData(data);
    });

    // Fallback: if socket gives no definitive answer in 8s, poll the order from API
    const fallback = setTimeout(async () => {
      try {
        const res = await axiosClient.get(`/api/admin/orders/${orderId}`, { silent: true });
        const order = res.data?.data;
        if (order?.orderStatus === 'Success') {
          setStatus('success');
          setEventData({
            planName: order.planId?.name,
            amount: order.amount,
            transactionId: order.transactionId,
          });
        } else if (order?.orderStatus === 'Failed') {
          setStatus('failed');
          setEventData({ reason: 'Payment was not completed.' });
        }
        // still Pending → leave on confirming
      } catch {
        // ignore
      }
    }, 8000);

    return () => {
      clearTimeout(fallback);
      socket.disconnect();
    };
  }, [userId, authLoading, orderId]);

  const toDashboard = () => navigate('/dashboard/analytics');
  const toRetry = () => navigate('/pages/pricing');

  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(.8); opacity: .8; }
          80%  { transform: scale(1.4); opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>

      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div className="card shadow-sm border-0 p-4 p-md-5">
            {status === 'confirming' && <StateConfirming />}
            {status === 'success'    && <StateSuccess data={eventData} orderId={orderId} onDashboard={toDashboard} />}
            {status === 'failed'     && <StateFailed  data={eventData} orderId={orderId} onRetry={toRetry} onDashboard={toDashboard} />}
          </div>
        </div>
      </div>
    </>
  );
}
