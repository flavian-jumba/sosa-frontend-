import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConferenceCardSkeleton } from "@/components/skeletons/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useConferences, useFeaturedConferences } from "@/hooks/useConferences";
import type { ConferenceFilters } from "@/types/api.types";
import { getImageUrls, normalizeAmenities } from "@/lib/api";
import { Users, DollarSign, Star, Search, Utensils } from "lucide-react";
import groundsImage from "@/assets/grounds-view.jpg";

const Conference = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [minAttendees, setMinAttendees] = useState<string>("");
  const [cateringOnly, setCateringOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("display_order");

  // Fetch featured conferences for hero section
  const { conferences: featured } = useFeaturedConferences();

  // Build filters
  const filters: ConferenceFilters = {
    search: searchTerm || undefined,
    min_attendees: minAttendees ? Number(minAttendees) : undefined,
    catering_available: cateringOnly || undefined,
    active_only: true,
    sort: sortBy,
    per_page: 12,
  };

  // Fetch all conferences with filters
  const { conferences, pagination, loading, loadMore } = useConferences(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${groundsImage})` }}
          >
            <div className="absolute inset-0 bg-primary/70" />
          </div>
          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4"
            >
              Conference & Events
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white/90"
            >
              Professional venues for your meetings, conferences, and special events
            </motion.p>
          </div>
        </section>

        {/* Featured Facilities */}
        {featured && featured.length > 0 && (
          <section className="py-12 bg-muted">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold mb-2">Featured Facilities</h2>
                <p className="text-muted-foreground">
                  Our most popular conference and event spaces
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.slice(0, 3).map((facility) => {
                  const images = getImageUrls(facility.images);
                  return (
                    <motion.div
                      key={facility.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="relative h-48">
                          <img
                            src={images[0]}
                            alt={facility.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <Badge className="absolute top-4 right-4 bg-primary">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">{facility.name}</h3>
                          <div 
                            className="text-sm text-muted-foreground mb-4 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: facility.description }}
                          />
                          <div className="flex items-center justify-between text-sm mb-4">
                            <div className="flex items-center gap-1">
                              <Users size={16} />
                              <span>{facility.min_capacity}-{facility.max_capacity}</span>
                            </div>
                            {facility.catering_available && (
                              <div className="flex items-center gap-1 text-green-600">
                                <Utensils size={16} />
                                <span>Catering</span>
                              </div>
                            )}
                          </div>
                          <Link to={`/conference-booking?facility=${facility.id}`}>
                            <Button className="w-full">Book Now</Button>
                          </Link>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <label className="block text-sm font-medium mb-2">Search Facilities</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="text"
                    placeholder="Search by name, type, or features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* Minimum Attendees */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-2">Min. Attendees</label>
                <Input
                  type="number"
                  placeholder="e.g., 50"
                  value={minAttendees}
                  onChange={(e) => setMinAttendees(e.target.value)}
                  min="0"
                />
              </div>

              {/* Sort By */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="display_order">Recommended</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="-name">Name (Z-A)</SelectItem>
                    <SelectItem value="min_capacity">Capacity (Low to High)</SelectItem>
                    <SelectItem value="-max_capacity">Capacity (High to Low)</SelectItem>
                    <SelectItem value="price_per_hour">Price (Low to High)</SelectItem>
                    <SelectItem value="-price_per_hour">Price (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Catering Filter */}
              <div className="flex items-center gap-2 pb-2">
                <input
                  type="checkbox"
                  id="catering"
                  checked={cateringOnly}
                  onChange={(e) => setCateringOnly(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="catering" className="text-sm cursor-pointer whitespace-nowrap">
                  Catering Available
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* All Facilities */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">All Conference Facilities</h2>
              {!loading && (
                <p className="text-muted-foreground">
                  {pagination ? pagination.total : (conferences?.length || 0)} facilities available
                </p>
              )}
            </motion.div>

            {loading && (!conferences || conferences.length === 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ConferenceCardSkeleton key={i} />
                ))}
              </div>
            ) : conferences && conferences.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {conferences.map((facility, index) => {
                    const images = getImageUrls(facility.images);
                    return (
                      <motion.div
                        key={facility.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                          <div className="relative h-48">
                            <img
                              src={images[0]}
                              alt={facility.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {facility.featured && (
                              <Badge className="absolute top-4 right-4 bg-primary">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-2">{facility.name}</h3>
                              <Badge variant="outline" className="mb-2">
                                {facility.room_type}
                              </Badge>
                              <div 
                                className="text-sm text-muted-foreground mb-4 line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: facility.description }}
                              />

                              <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-1">
                                    <Users size={16} />
                                    <span>Capacity:</span>
                                  </div>
                                  <span className="font-semibold">
                                    {facility.min_capacity}-{facility.max_capacity} people
                                  </span>
                                </div>
                  <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-1">
                                    <DollarSign size={16} />
                                    <span>Hourly Rate:</span>
                                  </div>
                                  <span className="font-semibold">
                                    KSh {facility.price_per_hour?.toLocaleString() || 'N/A'}
                                  </span>
                                </div>
                                {facility.catering_available && (
                                  <div className="flex items-center gap-1 text-sm text-green-600">
                                    <Utensils size={16} />
                                    <span>Catering Available</span>
                                  </div>
                                )}
                              </div>

                              {(() => {
                                const amenities = normalizeAmenities(facility.amenities);
                                return amenities.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-4">
                                    {amenities.slice(0, 3).map((amenity, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {amenity}
                                      </Badge>
                                    ))}
                                    {amenities.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{amenities.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>

                            <Link to={`/conference-booking?facility=${facility.id}`} className="mt-auto">
                              <Button className="w-full">Request Booking</Button>
                            </Link>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Load More */}
                {pagination && pagination.current_page < pagination.last_page && (
                  <div className="mt-12 text-center">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={loadMore}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Load More Facilities"}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No facilities match your filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Need Help Planning Your Event?</h2>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Our events team is here to help you plan the perfect conference or gathering.
                Contact us for personalized assistance and special packages.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/contact">
                  <Button size="lg" variant="secondary">
                    Contact Events Team
                  </Button>
                </Link>
                <Link to="/cottages">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                    View Accommodations
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Conference;
