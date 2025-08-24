import { useRouter } from "next/navigation";
import { EventForm } from "@/components/events/EventForm";
import { eventService } from "@/lib/api/services/eventService";
import { useToast } from "@/components/ui/use-toast";

export default function NewEventPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      const { error } = await eventService.createEvent(data);

      if (error) throw new Error(error);

      toast({
        title: "Success!",
        description: "Your event has been created successfully.",
      });

      router.push("/events");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw to let the form handle the error state
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to create your event
        </p>
      </div>

      <EventForm onSubmit={handleSubmit} submitLabel="Create Event" />
    </div>
  );
}
