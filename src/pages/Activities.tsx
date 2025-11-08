import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ActivityCard from "@/components/ActivityCard";
import { ActivityCardSkeleton } from "@/components/skeletons/LoadingSkeletons";
import { useActivities } from "@/hooks/useActivities";
import type { ActivityFilters } from "@/types/api.types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import groundsImage from "@/assets/grounds-view.jpg";

const Activities = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  // Build filters
  const filters: ActivityFilters = {
    search: searchTerm || undefined,
    difficulty: difficulty !== "all" ? (difficulty as ActivityFilters['difficulty']) : undefined,
    available: availableOnly || undefined,
    sort: sortBy,
    per_page: 12,
  };

  // Fetch activities
  const { activities, pagination, loading, loadMore } = useActivities(filters);

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
              Adventures & Activities
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white/90"
            >
              From thrilling adventures to peaceful moments in nature
            </motion.p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <label className="block text-sm font-medium mb-2">Search Activities</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="text"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* Difficulty Filter */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="challenging">Challenging</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="-name">Name (Z-A)</SelectItem>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="-price">Price (High to Low)</SelectItem>
                    <SelectItem value="duration_minutes">Duration (Short to Long)</SelectItem>
                    <SelectItem value="-duration_minutes">Duration (Long to Short)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Available Only */}
              <div className="flex items-center gap-2 pb-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="available" className="text-sm cursor-pointer">
                  Available Only
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Activities Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">What We Offer</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you're seeking adventure or relaxation, we have something special for everyone
                at Sosa Cottages.
              </p>
              {!loading && (
                <p className="text-sm text-muted-foreground mt-4">
                  {pagination ? pagination.total : (activities?.length || 0)} activities available
                </p>
              )}
            </motion.div>

            {loading && (!activities || activities.length === 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <ActivityCardSkeleton key={index} />
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ActivityCard activity={activity} />
                    </motion.div>
                  ))}
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
                      {loading ? "Loading..." : "Load More Activities"}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No activities match your filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold mb-4">Perfect for Everyone</h2>
                <p className="text-lg text-muted-foreground">
                  Our activities are designed to cater to all ages and interests
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-lg p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-3">Family Friendly</h3>
                  <p className="text-muted-foreground">
                    All our activities are suitable for families with children. Safety equipment and
                    supervision provided where needed.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-lg p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-3">Professional Guides</h3>
                  <p className="text-muted-foreground">
                    Our experienced guides ensure your safety and enhance your experience with local
                    knowledge and expertise.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-lg p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-3">Flexible Schedule</h3>
                  <p className="text-muted-foreground">
                    Activities available throughout the day. Book in advance or arrange on arrival
                    based on availability.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-lg p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-3">Equipment Provided</h3>
                  <p className="text-muted-foreground">
                    All necessary equipment and safety gear provided. Just bring your enthusiasm and
                    sense of adventure!
                  </p>
                </motion.div>
              </div>
            </div>
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
              <h2 className="text-4xl font-bold mb-6">Ready for Adventure?</h2>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Book your stay at Sosa Cottages and experience all the exciting activities we have to
                offer. Contact us for more information or special activity packages.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/booking">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Book Your Stay
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 text-white border-white hover:bg-white/20"
                  >
                    Contact Us
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

export default Activities;
