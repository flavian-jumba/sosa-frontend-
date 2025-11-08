import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCottage } from "@/hooks/useCottages";
import { getImageUrls, normalizeAmenities } from "@/lib/api";
import {
  Users,
  Wifi,
  Coffee,
  Tv,
  Star,
  MapPin,
  Check,
  ArrowLeft,
  Calendar,
} from "lucide-react";

const CottageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cottage, loading, error } = useCottage(Number(id));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-96 w-full mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !cottage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Cottage Not Found</h1>
            <p className="text-muted-foreground mb-8">{error || "The cottage you're looking for doesn't exist."}</p>
            <Button onClick={() => navigate("/cottages")}>
              <ArrowLeft className="mr-2" size={18} />
              Back to Cottages
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = getImageUrls(cottage.images);
  const mainImage = images[0];
  const galleryImages = images.slice(1);
  const amenities = normalizeAmenities(cottage.amenities);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-4 pt-8">
          <Button variant="ghost" onClick={() => navigate("/cottages")}>
            <ArrowLeft className="mr-2" size={18} />
            Back to Cottages
          </Button>
        </div>

        {/* Hero Image */}
        <section className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-96 rounded-lg overflow-hidden"
          >
            <img
              src={mainImage}
              alt={cottage.name}
              className="w-full h-full object-cover"
            />
            {cottage.featured && (
              <Badge className="absolute top-4 left-4 bg-primary">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            <Badge
              className={`absolute top-4 right-4 ${
                cottage.status === "active"
                  ? "bg-green-500"
                  : cottage.status === "maintenance"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {cottage.status.charAt(0).toUpperCase() + cottage.status.slice(1)}
            </Badge>
          </motion.div>

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {galleryImages.slice(0, 4).map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="h-32 rounded-lg overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${cottage.name} - Image ${idx + 2}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl font-bold mb-4">{cottage.name}</h1>
                <div className="flex items-center gap-4 mb-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users size={20} />
                    <span>Up to {cottage.capacity} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={20} />
                    <span>Sosa Cottages</span>
                  </div>
                </div>

                <Card className="p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-4">About This Cottage</h2>
                  <div 
                    className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: cottage.description }}
                  />
                </Card>

                {/* Amenities */}
                {amenities.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="text-green-500" size={20} />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 sticky top-24">
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      KSh {cottage.price_per_night.toLocaleString()}
                      <span className="text-base font-normal text-muted-foreground">
                        {" "}
                        / night
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users size={16} />
                      <span>Maximum {cottage.capacity} guests</span>
                    </div>
                  </div>

                  {cottage.status === "active" ? (
                    <Link to={`/booking?cottage=${cottage.id}`} className="block">
                      <Button className="w-full mb-4" size="lg">
                        <Calendar className="mr-2" size={18} />
                        Book Now
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full mb-4" size="lg" disabled>
                      Currently Unavailable
                    </Button>
                  )}

                  <div className="text-center text-sm text-muted-foreground">
                    You won't be charged yet
                  </div>

                  <div className="mt-6 pt-6 border-t space-y-4">
                    <h3 className="font-semibold mb-3">Key Features</h3>
                    <div className="space-y-3">
                      {cottage.amenities?.includes("Free WiFi") && (
                        <div className="flex items-center gap-2 text-sm">
                          <Wifi size={16} className="text-muted-foreground" />
                          <span>Free WiFi</span>
                        </div>
                      )}
                      {cottage.amenities?.includes("Breakfast") && (
                        <div className="flex items-center gap-2 text-sm">
                          <Coffee size={16} className="text-muted-foreground" />
                          <span>Breakfast Included</span>
                        </div>
                      )}
                      {cottage.amenities?.includes("TV") && (
                        <div className="flex items-center gap-2 text-sm">
                          <Tv size={16} className="text-muted-foreground" />
                          <span>Television</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-20 mt-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team is here to help you plan your perfect getaway. Contact us for more information
              or special requests.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/contact">
                <Button variant="default" size="lg">
                  Contact Us
                </Button>
              </Link>
              <Link to="/cottages">
                <Button variant="outline" size="lg">
                  View More Cottages
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CottageDetail;
