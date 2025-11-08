import { motion } from "framer-motion";
import { Users, Wifi, Coffee, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getImageUrls, normalizeAmenities } from "@/lib/api";
import type { Cottage } from "@/types/api.types";

interface CottageCardProps {
  cottage: Cottage;
}

const CottageCard = ({ cottage }: CottageCardProps) => {
  const images = getImageUrls(cottage.images);
  const mainImage = images[0];
  const amenities = normalizeAmenities(cottage.amenities);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={mainImage}
          alt={cottage.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
          KSh {cottage.price_per_night.toLocaleString()}/night
        </div>
        {cottage.featured && (
          <Badge className="absolute top-4 left-4 bg-primary">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">{cottage.name}</h3>
        <div 
          className="text-muted-foreground mb-4 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: cottage.description }}
        />
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{cottage.capacity} Guests</span>
          </div>
          {amenities.some(a => a.toLowerCase().includes('wifi')) && (
            <div className="flex items-center gap-1">
              <Wifi size={16} />
              <span>Free WiFi</span>
            </div>
          )}
          {amenities.some(a => a.toLowerCase().includes('breakfast')) && (
            <div className="flex items-center gap-1">
              <Coffee size={16} />
              <span>Breakfast</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link to={`/cottages/${cottage.id}`} className="flex-1">
            <Button variant="outline" className="w-full">View Details</Button>
          </Link>
          <Link to={`/booking?cottage=${cottage.id}`} className="flex-1">
            <Button className="w-full bg-primary hover:bg-secondary">Book Now</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CottageCard;
