import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CottageCard from "@/components/CottageCard";
import { CottageCardSkeleton } from "@/components/skeletons/LoadingSkeletons";
import { useCottages } from "@/hooks/useCottages";
import type { CottageFilters } from "@/types/api.types";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

const Cottages = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("-created_at");

  // Build filters object
  const filters: CottageFilters = {
    search: searchTerm || undefined,
    min_price: priceRange[0],
    max_price: priceRange[1],
    min_capacity: minCapacity || undefined,
    featured: featuredOnly || undefined,
    sort: sortBy,
    per_page: 12,
  };

  // Fetch cottages with filters
  const { cottages, pagination, loading, loadMore } = useCottages(filters);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Our Cottages
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-primary-foreground/90 max-w-2xl mx-auto"
            >
              Choose from our selection of beautifully designed cottages, each offering unique charm
              and comfort.
            </motion.p>
          </div>
        </section>

        {/* Filters and Cottages */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-card rounded-lg p-6 shadow-lg sticky top-24 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Filters</h3>
                    <SlidersHorizontal size={20} />
                  </div>

                  {/* Search */}
                  <form onSubmit={handleSearch}>
                    <label className="block text-sm font-medium mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        type="text"
                        placeholder="Search cottages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-created_at">Newest First</SelectItem>
                        <SelectItem value="created_at">Oldest First</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="-name">Name (Z-A)</SelectItem>
                        <SelectItem value="price_per_night">Price (Low to High)</SelectItem>
                        <SelectItem value="-price_per_night">Price (High to Low)</SelectItem>
                        <SelectItem value="capacity">Capacity (Low to High)</SelectItem>
                        <SelectItem value="-capacity">Capacity (High to Low)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Featured Only */}
                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featuredOnly}
                        onChange={(e) => setFeaturedOnly(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Featured Only</span>
                    </label>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Price Range (per night)
                    </label>
                    <Slider
                      min={0}
                      max={20000}
                      step={500}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>KSh {priceRange[0].toLocaleString()}</span>
                      <span>KSh {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Minimum Capacity */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Minimum Capacity</label>
                    <div className="space-y-2">
                      {[0, 2, 4, 6, 8].map((cap) => (
                        <label key={cap} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="capacity"
                            checked={minCapacity === cap}
                            onChange={() => setMinCapacity(cap)}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{cap === 0 ? "Any" : `${cap}+ guests`}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Cottages Grid */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  {loading ? (
                    <p className="text-muted-foreground">Loading cottages...</p>
                  ) : (
                    <p className="text-muted-foreground">
                      {pagination ? pagination.total : (cottages?.length || 0)} cottage{(pagination?.total || cottages?.length || 0) !== 1 ? "s" : ""} available
                    </p>
                  )}
                </motion.div>

                {loading && (!cottages || cottages.length === 0) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(6)].map((_, index) => (
                      <CottageCardSkeleton key={index} />
                    ))}
                  </div>
                ) : cottages && cottages.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {cottages.map((cottage, index) => (
                        <motion.div
                          key={cottage.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <CottageCard cottage={cottage} />
                        </motion.div>
                      ))}
                    </div>

                    {/* Load More Button */}
                    {pagination && pagination.current_page < pagination.last_page && (
                      <div className="mt-12 text-center">
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={loadMore}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Load More Cottages"}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No cottages match your filters. Try adjusting your search criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cottages;
