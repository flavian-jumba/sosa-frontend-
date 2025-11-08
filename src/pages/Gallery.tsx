import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GalleryItemSkeleton } from "@/components/skeletons/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { galleryService } from "@/services/galleryService";
import { getImageUrl } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Gallery as GalleryType } from "@/types/api.types";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import groundsImage from "@/assets/grounds-view.jpg";

const Gallery = () => {
  const [galleries, setGalleries] = useState<GalleryType[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<GalleryType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentGalleryImages, setCurrentGalleryImages] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const data = await galleryService.getGalleries({ is_active: true });
        setGalleries(data.data || []);
        setFilteredGalleries(data.data || []);
      } catch (error) {
        console.error('Error fetching galleries:', error);
        setGalleries([]);
        setFilteredGalleries([]);
        toast({
          title: "Error",
          description: "Failed to load gallery. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, [toast]);

  useEffect(() => {
    if (category === "all") {
      setFilteredGalleries(galleries);
    } else {
      setFilteredGalleries(galleries.filter((g) => g.category === category));
    }
  }, [category, galleries]);

  const openLightbox = (images: string[], index: number) => {
    setCurrentGalleryImages(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImageIndex(0);
    setCurrentGalleryImages([]);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? currentGalleryImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === currentGalleryImages.length - 1 ? 0 : prev + 1));
  };

  // Get unique categories - safely handle non-array galleries
  const categories = ["all", ...(Array.isArray(galleries) ? new Set(galleries.map((g) => g.category)) : [])];

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
              Our Gallery
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white/90"
            >
              Explore the beauty and comfort of Sosa Cottages through our photo collection
            </motion.p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-muted">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Browse Our Collections</h2>
                <p className="text-muted-foreground">
                  {!loading && `${filteredGalleries?.length || 0} ${(filteredGalleries?.length || 0) === 1 ? "collection" : "collections"}`}
                </p>
              </div>
              <div className="w-full md:w-64">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <GalleryItemSkeleton key={i} />
                ))}
              </div>
            ) : filteredGalleries && filteredGalleries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGalleries.map((gallery, index) => {
                  const imageUrl = getImageUrl(gallery.image_path);
                  
                  // Group galleries by category for lightbox
                  const categoryImages = filteredGalleries
                    .filter(g => g.category === gallery.category)
                    .map(g => getImageUrl(g.image_path));
                  
                  const indexInCategory = categoryImages.indexOf(imageUrl);
                  
                  return (
                    <motion.div
                      key={gallery.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                      onClick={() => openLightbox(categoryImages, indexInCategory)}
                    >
                      <div className="relative aspect-[4/3]">
                        <img
                          src={imageUrl}
                          alt={gallery.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ZoomIn className="text-white" size={48} />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold mb-1">{gallery.title}</h3>
                        {gallery.description && (
                          <p className="text-sm text-white/90 line-clamp-2">
                            {gallery.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">
                            {gallery.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No galleries found in this category.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Lightbox Modal */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/95">
            <DialogTitle className="sr-only">Image Gallery Viewer</DialogTitle>
            <div className="relative w-full h-[95vh] flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X size={24} />
              </Button>

              {/* Navigation Buttons */}
              {currentGalleryImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft size={32} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                    onClick={goToNext}
                  >
                    <ChevronRight size={32} />
                  </Button>
                </>
              )}

              {/* Image */}
              <img
                src={currentGalleryImages[currentImageIndex]}
                alt={`Gallery image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Image Counter */}
              {currentGalleryImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {currentGalleryImages.length}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Experience It Yourself</h2>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                These photos are just a glimpse of what awaits you at Sosa Cottages.
                Book your stay today and create your own unforgettable memories.
              </p>
              <Button size="lg" variant="secondary">
                Book Your Stay
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
