import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Button, Typography, message } from 'antd';
import { qrCodeAPI } from '@/lib/api';

const { Text, Title } = Typography;

const Redirector: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const handleRedirect = async () => {
      try {
        // If id present, fetch QR and track
        if (id) {
          // Fire-and-forget track
          qrCodeAPI.incrementScan(id).catch(() => {});

          // Get QR content
          const res = await qrCodeAPI.getOne(id);
          const qr = res.qrCode || res;
          const target = qr?.content;
          if (!target) throw new Error('Destination not found');
          if (!mounted) return;
          setContent(target);

          // perform redirect after short delay to allow user to see page
          setTimeout(() => {
            window.location.href = target;
          }, 500);
          return;
        }

        // If content provided in query param 'u'
        const u = searchParams.get('u');
        if (u) {
          const decoded = decodeURIComponent(u);
          setContent(decoded);
          // Directly redirect (demo/preview)
          setTimeout(() => window.location.href = decoded, 300);
          return;
        }

        // else nothing to do
        throw new Error('No target specified');
      } catch (err: unknown) {
        const e = err as Error;
        message.error(e?.message || 'Redirect failed');
        setLoading(false);
      }
    };

    handleRedirect();
    return () => { mounted = false; };
  }, [id, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        {loading ? (
          <div className="py-12">
            <Spin size="large" />
            <div className="mt-4">
              <Text>Redirecting...</Text>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <Title level={4}>Redirect</Title>
            <Text type="secondary">Could not redirect automatically.</Text>
            <div className="mt-6">
              <Button type="primary" onClick={() => { if (content) window.location.href = content; }}>Open Link</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Redirector;