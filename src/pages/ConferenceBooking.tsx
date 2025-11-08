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
import { CalendarIcon, Loader2, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useConferences } from "@/hooks/useConferences";
import { conferenceService } from "@/services/conferenceService";
import { conferenceBookingService } from "@/services/conferenceBookingService";

const ConferenceBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch available conference facilities
  const { conferences } = useConferences({ status: 'active', per_page: 100 });

  // Form state
  const [bookingDate, setBookingDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const [bookingType, setBookingType] = useState<'hourly' | 'half_day' | 'full_day'>('hourly');
  const [attendees, setAttendees] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [cateringRequired, setCateringRequired] = useState<boolean>(false);
  const [specialRequirements, setSpecialRequirements] = useState<string>("");

  // UI state
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  // Get facility ID from URL if present
  useEffect(() => {
    const facilityId = searchParams.get('facility');
    if (facilityId) {
      setSelectedFacility(facilityId);
    }
  }, [searchParams]);

  // Calculate price when relevant fields change
  useEffect(() => {
    const calculatePrice = async () => {
      if (selectedFacility && bookingDate && bookingType) {
        // For hourly bookings, also need start and end time
        if (bookingType === 'hourly' && (!startTime || !endTime)) {
          return;
        }

        setIsCalculating(true);
        try {
          let durationHours: number | undefined;
          if (bookingType === 'hourly' && startTime && endTime) {
            // Calculate hours between start and end time
            const [startHour, startMin] = startTime.split(':').map(Number);
            const [endHour, endMin] = endTime.split(':').map(Number);
            durationHours = (endHour + endMin / 60) - (startHour + startMin / 60);
          }

          const result = await conferenceService.calculatePrice(
            Number(selectedFacility),
            {
              booking_type: bookingType,
              duration_hours: durationHours,
            }
          );
          // Handle both total_price and total_amount field names, and ensure it's a valid number
          const price = result.total_price ?? result.total_amount;
          setCalculatedPrice(typeof price === 'number' ? price : null);
        } catch (error) {
          console.error('Failed to calculate price:', error);
          setCalculatedPrice(null);
        } finally {
          setIsCalculating(false);
        }
      }
    };

    // Debounce the calculation
    const timer = setTimeout(calculatePrice, 500);
    return () => clearTimeout(timer);
  }, [selectedFacility, bookingDate, startTime, endTime, bookingType, cateringRequired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!bookingDate || !selectedFacility || !attendees || !customerName || !customerEmail || !customerPhone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (bookingType === 'hourly' && (!startTime || !endTime)) {
      toast({
        title: "Validation Error",
        description: "Please select start and end times for hourly booking.",
        variant: "destructive",
      });
      return;
    }

    // Validate attendees against facility capacity
    const facility = conferences.find(c => c.id === Number(selectedFacility));
    if (facility) {
      const numAttendees = Number(attendees);
      if (numAttendees < facility.min_capacity || numAttendees > facility.max_capacity) {
        toast({
          title: "Invalid Number of Attendees",
          description: `This facility accommodates ${facility.min_capacity}-${facility.max_capacity} attendees.`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Set default times for non-hourly bookings
      const finalStartTime = bookingType === 'hourly' ? startTime : '09:00';
      const finalEndTime = bookingType === 'hourly' ? endTime : (bookingType === 'half_day' ? '13:00' : '17:00');

      const booking = await conferenceBookingService.createBooking({
        conference_id: Number(selectedFacility),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        booking_date: format(bookingDate, 'yyyy-MM-dd'),
        start_time: finalStartTime,
        end_time: finalEndTime,
        booking_type: bookingType,
        number_of_attendees: Number(attendees),
        total_amount: calculatedPrice || 0,
        catering_required: cateringRequired,
        special_requirements: specialRequirements || undefined,
      });

      setBookingSuccess(true);
      setBookingId(booking.id);
      
      toast({
        title: "Booking Request Submitted!",
        description: `Your conference booking request (#${booking.id}) has been submitted. We will contact you shortly to confirm.`,
      });
    } catch (error: unknown) {
      console.error('Conference booking error:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to create conference booking. Please try again or contact support.";
      
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
              Book Conference Facility
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-primary-foreground/90"
            >
              Reserve the perfect venue for your meeting or event
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
              className="max-w-4xl mx-auto"
            >
              {bookingSuccess ? (
                // Success State
                <div className="bg-card rounded-lg shadow-xl p-8 text-center">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-4">Booking Request Submitted!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your conference booking request (#{bookingId}) has been submitted successfully. 
                    Our events team will contact you within 24 hours to confirm the details and finalize your booking.
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button onClick={() => navigate('/')}>
                      Return Home
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/conference')}>
                      Browse More Facilities
                    </Button>
                  </div>
                </div>
              ) : (
                // Booking Form
                <div className="bg-card rounded-lg shadow-xl p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <Label htmlFor="customerName">Full Name *</Label>
                          <Input 
                            id="customerName" 
                            placeholder="John Doe" 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerEmail">Email *</Label>
                          <Input 
                            id="customerEmail" 
                            type="email" 
                            placeholder="john@example.com"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerPhone">Phone Number *</Label>
                          <Input 
                            id="customerPhone" 
                            type="tel" 
                            placeholder="+254 XXX XXXXXX"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Facility Selection */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Facility & Date</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Select Facility *</Label>
                          <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a facility" />
                            </SelectTrigger>
                            <SelectContent>
                              {conferences && conferences.map((facility) => (
                                <SelectItem key={facility.id} value={facility.id.toString()}>
                                  {facility.name} ({facility.min_capacity}-{facility.max_capacity} pax)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedFacility && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {conferences.find(c => c.id === Number(selectedFacility))?.description}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label>Booking Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !bookingDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {bookingDate ? format(bookingDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={bookingDate}
                                onSelect={setBookingDate}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    {/* Booking Type & Time */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Booking Type & Duration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label>Booking Type *</Label>
                          <Select value={bookingType} onValueChange={(value: string) => setBookingType(value as 'hourly' | 'half_day' | 'full_day')}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="half_day">Half Day (4 hours)</SelectItem>
                              <SelectItem value="full_day">Full Day (8 hours)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {bookingType === 'hourly' && (
                          <>
                            <div>
                              <Label htmlFor="startTime">Start Time *</Label>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input
                                  id="startTime"
                                  type="time"
                                  value={startTime}
                                  onChange={(e) => setStartTime(e.target.value)}
                                  className="pl-10"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="endTime">End Time *</Label>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input
                                  id="endTime"
                                  type="time"
                                  value={endTime}
                                  onChange={(e) => setEndTime(e.target.value)}
                                  className="pl-10"
                                  required
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Attendees & Catering */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Event Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="attendees">Number of Attendees *</Label>
                          <Input
                            id="attendees"
                            type="number"
                            min="1"
                            placeholder="50"
                            value={attendees}
                            onChange={(e) => setAttendees(e.target.value)}
                            required
                          />
                          {selectedFacility && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Capacity: {conferences.find(c => c.id === Number(selectedFacility))?.min_capacity}-
                              {conferences.find(c => c.id === Number(selectedFacility))?.max_capacity} people
                            </p>
                          )}
                        </div>

                        <div className="flex items-end pb-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="catering"
                              checked={cateringRequired}
                              onChange={(e) => setCateringRequired(e.target.checked)}
                              className="rounded"
                              disabled={selectedFacility && !conferences.find(c => c.id === Number(selectedFacility))?.catering_available}
                            />
                            <label htmlFor="catering" className="text-sm cursor-pointer">
                              Catering Required
                              {selectedFacility && !conferences.find(c => c.id === Number(selectedFacility))?.catering_available && (
                                <span className="text-muted-foreground ml-2">(Not available for this facility)</span>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special Requirements */}
                    <div>
                      <Label htmlFor="requirements">Special Requirements (Optional)</Label>
                      <textarea
                        id="requirements"
                        value={specialRequirements}
                        onChange={(e) => setSpecialRequirements(e.target.value)}
                        className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background"
                        placeholder="Any special setup, equipment, or other requirements..."
                      />
                    </div>

                    {/* Price Summary */}
                    {selectedFacility && bookingDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-muted rounded-lg p-6"
                      >
                        <h3 className="text-lg font-bold mb-3">Booking Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Facility:</span>
                            <span className="font-medium">
                              {conferences.find(c => c.id === Number(selectedFacility))?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span className="font-medium">
                              {format(bookingDate, "PPP")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Booking Type:</span>
                            <span className="font-medium capitalize">
                              {bookingType.replace('_', ' ')}
                            </span>
                          </div>
                          {bookingType === 'hourly' && startTime && endTime && (
                            <div className="flex justify-between">
                              <span>Time:</span>
                              <span className="font-medium">
                                {startTime} - {endTime}
                              </span>
                            </div>
                          )}
                          {cateringRequired && (
                            <div className="flex justify-between">
                              <span>Catering:</span>
                              <span className="font-medium text-green-600">Included</span>
                            </div>
                          )}
                          {isCalculating ? (
                            <div className="flex items-center justify-between">
                              <span>Estimated Total:</span>
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-muted-foreground">Calculating...</span>
                              </div>
                            </div>
                          ) : calculatedPrice !== null && typeof calculatedPrice === 'number' ? (
                            <div className="border-t pt-2 flex justify-between text-lg font-bold">
                              <span>Estimated Total:</span>
                              <span className="text-accent">
                                KSh {calculatedPrice.toLocaleString()}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </motion.div>
                    )}

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-primary hover:bg-secondary"
                      disabled={isSubmitting || isCalculating}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Submit Booking Request"
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      * Our events team will contact you to confirm availability and finalize the booking details.
                    </p>
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

export default ConferenceBooking;
