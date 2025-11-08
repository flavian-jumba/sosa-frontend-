import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export const ApiStatusBanner = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Try a simple health check or any public endpoint
        await api.get('/health').catch(() => {
          // If health endpoint doesn't exist, try any public endpoint
          return api.get('/public/cottages?per_page=1');
        });
        setStatus('online');
        setShowBanner(false);
      } catch (error) {
        console.error('API is offline:', error);
        setStatus('offline');
        setShowBanner(true);
      }
    };

    checkApiStatus();
    
    // Check every 30 seconds if offline
    const interval = setInterval(() => {
      if (status === 'offline') {
        checkApiStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [status]);

  if (!showBanner || status === 'online') {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <Alert variant="destructive" className="max-w-4xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>API Connection Issue</AlertTitle>
        <AlertDescription>
          Unable to connect to the server. Some features may not work properly. 
          We're attempting to reconnect...
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const ApiStatus = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await api.get('/health').catch(() => {
          return api.get('/public/cottages?per_page=1');
        });
        setStatus('online');
      } catch (error) {
        setStatus('offline');
      }
    };

    checkApiStatus();
  }, []);

  const statusConfig = {
    checking: { icon: Loader2, text: 'Checking...', className: 'text-muted-foreground animate-spin' },
    online: { icon: CheckCircle2, text: 'Connected', className: 'text-green-500' },
    offline: { icon: AlertCircle, text: 'Disconnected', className: 'text-destructive' },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className={`h-4 w-4 ${config.className}`} />
      <span className="text-muted-foreground">{config.text}</span>
    </div>
  );
};
