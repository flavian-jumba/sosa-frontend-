import { Button } from '@/components/ui/button';
import { clearCache } from '@/lib/api';
import { RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/**
 * Cache Clear Button Component
 * 
 * A utility button to manually clear the API cache.
 * Useful for development and when you need to force refresh data.
 */
export const CacheClearButton = () => {
  const handleClearCache = async () => {
    try {
      await clearCache();
      toast({
        title: 'Cache Cleared',
        description: 'API cache has been cleared. The page will refresh with fresh data.',
      });
      // Reload the page to fetch fresh data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear cache. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClearCache}
      className="flex items-center gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Clear Cache
    </Button>
  );
};
