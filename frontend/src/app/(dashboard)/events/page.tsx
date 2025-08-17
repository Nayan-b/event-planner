import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";

// Mock data - replace with your actual data fetching
const mockEvents = [
  {
    id: 1,
    title: "Tech Conference 2023",
    description: "Annual technology conference featuring industry leaders and innovators.",
    date: "2023-12-15",
    time: "09:00",
    location: "Convention Center, San Francisco",
    category: "Technology",
    capacity: 500,
    registered: 342,
    image: "/images/tech-conference.jpg"
  },
  {
    id: 2,
    title: "Startup Pitch Night",
    description: "Witness the most promising startups pitch their ideas to investors.",
    date: "2023-11-30",
    time: "18:30",
    location: "Innovation Hub, New York",
    category: "Business",
    capacity: 200,
    registered: 187,
    image: "/images/startup-pitch.jpg"
  },
  {
    id: 3,
    title: "Blockchain Workshop",
    description: "Hands-on workshop on building decentralized applications.",
    date: "2023-12-05",
    time: "14:00",
    location: "Tech Campus, Austin",
    category: "Blockchain",
    capacity: 50,
    registered: 42,
    image: "/images/blockchain-workshop.jpg"
  },
];

export default function EventsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
          <p className="text-muted-foreground mt-2">
            Discover and join exciting events in your area
          </p>
        </div>
        <Button asChild>
          <Link href="/events/new">Create Event</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockEvents.map((event) => (
          <Card key={event.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
              {/* Replace with actual image */}
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <span className="text-xl font-semibold">{event.title}</span>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="mt-1">{event.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="whitespace-nowrap">
                  {event.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{event.registered}/{event.capacity} registered</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/events/${event.id}`}>View Details</Link>
              </Button>
              <Button asChild>
                <Link href={`/events/${event.id}/register`}>Register</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
