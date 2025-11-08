import { useEffect, useState } from 'react';
import api, { API_BASE_URL } from '@/lib/api';

export default function ApiTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API with base URL:', API_BASE_URL);
        const response = await api.get('/public/cottages?per_page=3');
        console.log('API Response:', response);
        setData(response.data);
        setStatus('success');
      } catch (err: unknown) {
        console.error('API Error:', err);
        setError((err as Error).message || 'Unknown error');
        setStatus('error');
      }
    };

    testApi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Configuration:</h2>
          <p className="text-gray-700">Base URL: <code className="bg-gray-200 px-2 py-1 rounded">{API_BASE_URL}</code></p>
          <p className="text-gray-700">Full API URL: <code className="bg-gray-200 px-2 py-1 rounded">{API_BASE_URL}/api/v1</code></p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Status:</h2>
          {status === 'loading' && (
            <div className="text-blue-600">🔄 Testing connection...</div>
          )}
          {status === 'success' && (
            <div className="text-green-600">✅ Successfully connected to backend!</div>
          )}
          {status === 'error' && (
            <div className="text-red-600">❌ Connection failed: {error}</div>
          )}
        </div>

        {data && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Response Data:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
