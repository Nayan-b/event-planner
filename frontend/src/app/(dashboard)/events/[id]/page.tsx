"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { eventService } from "@/lib/api/services/eventService";
import { Event } from "@/lib/types";
import { Loader2, MapPin, CalendarIcon, Clock, Users, AlertCircle, ArrowLeft } from "lucide-react";

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEventAndRsvp = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch event details
        const { data: eventData, error: eventError } = await eventService.getEvent(id as string);
        if (eventError) throw new Error(eventError);
        
        if (eventData) {
          setEvent(eventData);
          
          // Fetch user's RSVP status
          const { data: rsvpData } = await eventService.getUserRsvp(id as string);
          if (rsvpData?.status) {
            setRsvpStatus(rsvpData.status);
          }
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load event details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndRsvp();
  }, [id, toast]);

  const handleRsvp = async (status: 'going' | 'not_going' | 'maybe') => {
    try {
      setIsSubmitting(true);
      const { error } = await eventService.rsvpToEvent(id as string, status);
      
      if (error) throw new Error(error);
      
      setRsvpStatus(status);
      toast({
        title: "Success",
        description: `You've successfully ${status === 'going' ? 'RSVP\'d' : 'updated your RSVP'} for this event!`,
      });
      
      // Update the event's registered count
      if (event) {
        setEvent({
          ...event,
          registered: status === 'going' 
            ? event.registered + 1 
            : rsvpStatus === 'going' 
              ? Math.max(0, event.registered - 1) 
              : event.registered
        });
      }
    } catch (err) {
      console.error("Error updating RSVP:", err);
      toast({
        title: "Error",
        description: "Failed to update your RSVP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Button>
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || "The event you're looking for doesn't exist or may have been removed."}
          </p>
          <Button onClick={() => router.push('/events')}>Browse All Events</Button>
        </div>
      </div>
    );
  }

  const isRegistered = rsvpStatus === 'going';
  const isMaybe = rsvpStatus === 'maybe';
  const isNotGoing = rsvpStatus === 'not_going';
  const isFull = event.registered >= event.capacity;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {event.category}
              </Badge>
              {isFull && (
                <Badge variant="destructive" className="text-sm">
                  Full
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <CalendarIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(event.date), "EEEE, MMMM d, yyyy")}
                    {event.time && ` • ${event.time}`}
                  </p>
                </div>
              </div>
              
              {event.location && (
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <Users className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-sm text-muted-foreground">
                    {event.registered} of {event.capacity} spots filled
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (event.registered / event.capacity) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {event.description && (
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{event.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RSVP sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>RSVP</CardTitle>
              <CardDescription>
                {isFull && !isRegistered 
                  ? "This event is currently full. You can still express interest if spots open up."
                  : "Let us know if you'll be attending!"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => handleRsvp('going')} 
                disabled={isSubmitting || (isFull && !isRegistered)}
                className={`w-full ${isRegistered ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {isSubmitting && rsvpStatus === 'going' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isRegistered ? 'You\'re Going' : 'I\'ll Be There'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => handleRsvp('maybe')}
                disabled={isSubmitting}
                className={`w-full ${isMaybe ? 'border-yellow-500 text-yellow-600' : ''}`}
              >
                {isSubmitting && rsvpStatus === 'maybe' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isMaybe ? 'Interested' : 'Maybe'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => handleRsvp('not_going')}
                disabled={isSubmitting}
                className={`w-full ${isNotGoing ? 'border-destructive/20 text-destructive' : ''}`}
              >
                {isSubmitting && rsvpStatus === 'not_going' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isNotGoing ? 'Not Attending' : 'Can\'t Make It'}
              </Button>
              
              {isFull && !isRegistered && (
                <p className="text-xs text-muted-foreground mt-2">
                  You'll be added to the waitlist if you RSVP.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
