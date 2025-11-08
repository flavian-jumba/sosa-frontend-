import { motion } from "framer-motion";
import {
  Target,
  TreePine,
  Flame,
  Sparkles,
  Baby,
  Music,
  Bike,
  Waves,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { getImageUrl } from "@/lib/api";
import type { Activity } from "@/types/api.types";

interface ActivityCardProps {
  activity: Activity;
}

// Map activity names to icons
const activityIcons: Record<string, LucideIcon> = {
  archery: Target,
  nature: TreePine,
  bonfire: Flame,
  zipline: Sparkles,
  kids: Baby,
  music: Music,
  cycling: Bike,
  swimming: Waves,
  default: Sparkles,
};

const getActivityIcon = (name: string): LucideIcon => {
  const lowercaseName = name.toLowerCase();
  for (const [key, icon] of Object.entries(activityIcons)) {
    if (lowercaseName.includes(key)) {
      return icon;
    }
  }
  return activityIcons.default;
};

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const Icon = getActivityIcon(activity.name);
  const imageUrl = getImageUrl(activity.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {!activity.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Temporarily Unavailable</Badge>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-accent/10 rounded-lg">
            <Icon className="text-accent" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{activity.name}</h3>
            <Badge variant="outline" className="mt-1 text-xs">
              {activity.difficulty}
            </Badge>
          </div>
        </div>
        <div 
          className="text-muted-foreground mb-4 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: activity.description }}
        />
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{activity.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>Max {activity.max_participants}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            KSh {activity.price.toLocaleString()}
          </span>
          <Button
            variant={activity.is_available ? "default" : "outline"}
            disabled={!activity.is_available}
          >
            {activity.is_available ? "Book Now" : "Not Available"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
