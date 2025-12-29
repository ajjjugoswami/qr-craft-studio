import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { AlertCircle } from 'lucide-react';

const QRUnavailable: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'unavailable';
  const navigate = useNavigate();

  let title = 'QR Code Unavailable';
  let message = 'This QR code is not accessible.';

  if (reason === 'expired') {
    title = 'QR Code Expired';
    message = 'This QR code has passed its expiration date.';
  } else if (reason === 'limit') {
    title = 'Scan Limit Reached';
    message = 'This QR code has reached the maximum number of scans.';
  } else if (reason === 'inactive') {
    title = 'QR Code Inactive';
    message = 'This QR code has been deactivated by the owner.';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-700 flex items-center justify-center p-6">
      <div className="bg-white/6 backdrop-blur-lg p-8 rounded-3xl max-w-md w-full text-center border border-white/10">
        <div className="mx-auto w-20 h-20 rounded-xl bg-red-600/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-white">{title}</h2>
        <p className="text-white/70 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button type="primary" onClick={() => window.location.href = '/'}>Go Home</Button>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    </div>
  );
};

export default QRUnavailable;
