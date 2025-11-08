import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const CottageCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </Card>
  );
};

export const ActivityCardSkeleton = () => {
  return (
    <Card className="p-6 space-y-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </Card>
  );
};

export const TestimonialSkeleton = () => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </Card>
  );
};

export const ConferenceCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between pt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </Card>
  );
};

export const GalleryItemSkeleton = () => {
  return (
    <div className="relative group overflow-hidden rounded-lg">
      <Skeleton className="aspect-square w-full" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <Skeleton className="h-4 w-2/3 bg-white/20" />
        <Skeleton className="h-3 w-1/2 bg-white/20" />
      </div>
    </div>
  );
};

export const MenuItemSkeleton = () => {
  return (
    <Card className="flex gap-4 p-4">
      <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/4 mt-2" />
      </div>
    </Card>
  );
};
