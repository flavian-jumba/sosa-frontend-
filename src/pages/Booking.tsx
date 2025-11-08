import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCottages } from "@/hooks/useCottages";
import { cottageService } from "@/services/cottageService";
import { bookingService } from "@/services/bookingService";

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch available cottages
  const { cottages } = useCottages({ status: 'active', per_page: 100 });

  // Form state
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [selectedCottage, setSelectedCottage] = useState<string>("");
  const [guests, setGuests] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");

  // UI state
  const [isCheckingAvailability, setIsCheckingAvailability] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  // Get cottage ID from URL if present
  useEffect(() => {
    const cottageId = searchParams.get('cottage');
    if (cottageId) {
      setSelectedCottage(cottageId);
    }
  }, [searchParams]);

  // Check availability when dates and cottage change
  useEffect(() => {
    const checkAvailability = async () => {
      if (checkIn && checkOut && selectedCottage) {
        setIsCheckingAvailability(true);
        setIsAvailable(null);
        try {
          const result = await cottageService.checkAvailability(
            Number(selectedCottage),
            {
              check_in: format(checkIn, 'yyyy-MM-dd'),
              check_out: format(checkOut, 'yyyy-MM-dd')
            }
          );
          setIsAvailable(result.available);
          if (!result.available) {
            toast({
              title: "Not Available",
              description: result.message || "This cottage is not available for the selected dates. Please choose different dates.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to check availability. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsCheckingAvailability(false);
        }
      }
    };

    // Debounce the availability check
    const timer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, selectedCottage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!checkIn || !checkOut || !selectedCottage || !guests || !firstName || !lastName || !email || !phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isAvailable) {
      toast({
        title: "Not Available",
        description: "Please select available dates for your booking.",
        variant: "destructive",
      });
      return;
    }

    // Calculate total price
    const cottage = cottages.find(c => c.id === Number(selectedCottage));
    if (!cottage) {
      toast({
        title: "Error",
        description: "Selected cottage not found.",
        variant: "destructive",
      });
      return;
    }

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = cottage.price_per_night * nights;

    setIsSubmitting(true);
    try {
      const booking = await bookingService.createBooking({
        cottage_id: Number(selectedCottage),
        check_in: format(checkIn, 'yyyy-MM-dd'),
        check_out: format(checkOut, 'yyyy-MM-dd'),
        guests: Number(guests),
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        special_requests: specialRequests || undefined,
      });

      setBookingSuccess(true);
      setBookingId(booking.id);
      
      toast({
        title: "Booking Confirmed!",
        description: `Your booking (#${booking.id}) has been confirmed. Check your email for details.`,
      });
    } catch (error: unknown) {
      console.error('Cottage booking error:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to create booking. Please try again or contact support.";
      
      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              Book Your Stay
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-primary-foreground/90"
            >
              Reserve your perfect getaway at Sosa Cottages
            </motion.p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              {bookingSuccess ? (
                // Success State
                <div className="bg-card rounded-lg shadow-xl p-8 text-center">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your booking (#{bookingId}) has been successfully confirmed. 
                    You will receive a confirmation email shortly with all the details.
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button onClick={() => navigate('/')}>
                      Return Home
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/cottages')}>
                      Browse More Cottages
                    </Button>
                  </div>
                </div>
              ) : (
                // Booking Form
                <div className="bg-card rounded-lg shadow-xl p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input 
                            id="firstName" 
                            placeholder="John" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Doe" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input 
                            id="phone" 
                            type="tel" 
                            placeholder="+254 XXX XXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Booking Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Check-in Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !checkIn && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkIn ? format(checkIn, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={checkIn}
                                onSelect={setCheckIn}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <Label>Check-out Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !checkOut && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkOut ? format(checkOut, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={checkOut}
                                onSelect={setCheckOut}
                                disabled={(date) => date < new Date() || (checkIn ? date <= checkIn : false)}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <Label>Select Cottage *</Label>
                          <Select value={selectedCottage} onValueChange={setSelectedCottage}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a cottage" />
                            </SelectTrigger>
                            <SelectContent>
                              {cottages && cottages.map((cottage) => (
                                <SelectItem key={cottage.id} value={cottage.id.toString()}>
                                  {cottage.name} - KSh {cottage.price_per_night.toLocaleString()}/night
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="guests">Number of Guests *</Label>
                          <Input
                            id="guests"
                            type="number"
                            min="1"
                            placeholder="2"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Availability Status */}
                      {isCheckingAvailability && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Checking availability...</span>
                        </div>
                      )}
                      {!isCheckingAvailability && isAvailable === true && (
                        <div className="flex items-center gap-2 text-sm text-green-600 mt-4">
                          <CheckCircle className="w-4 h-4" />
                          <span>Available for selected dates</span>
                        </div>
                      )}
                    </div>

                    {/* Special Requests */}
                    <div>
                      <Label htmlFor="requests">Special Requests (Optional)</Label>
                      <textarea
                        id="requests"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background"
                        placeholder="Any special requirements or requests..."
                      />
                    </div>

                    {/* Price Summary */}
                    {checkIn && checkOut && selectedCottage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-muted rounded-lg p-6"
                      >
                        <h3 className="text-lg font-bold mb-3">Booking Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Cottage:</span>
                            <span className="font-medium">
                              {cottages.find(c => c.id === Number(selectedCottage))?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Nights:</span>
                            <span className="font-medium">
                              {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Price per night:</span>
                            <span className="font-medium">
                              KSh {cottages.find(c => c.id === Number(selectedCottage))?.price_per_night.toLocaleString()}
                            </span>
                          </div>
                          <div className="border-t pt-2 flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-accent">
                              KSh{" "}
                              {(
                                (cottages.find(c => c.id === Number(selectedCottage))?.price_per_night || 0) *
                                Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-primary hover:bg-secondary"
                      disabled={isSubmitting || !isAvailable || isCheckingAvailability}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
