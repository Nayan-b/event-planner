import { Event } from "@/lib/types";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return {
      error: error.detail || error.message || "An error occurred",
    };
  }
  const data = await response.json();
  return { data };
}

export const eventService = {
  // Get all events
  async getEvents(): Promise<ApiResponse<Event[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      return handleResponse<Event[]>(response);
    } catch (error) {
      return { error: "Failed to fetch events. Please check your connection." };
    }
  },

  // Get single event by ID
  async getEvent(id: string): Promise<ApiResponse<Event>> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      return handleResponse<Event>(response);
    } catch (error) {
      return { error: "Failed to fetch event details." };
    }
  },

  // Create new event
  async createEvent(
    eventData: Omit<Event, "id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<Event>> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(eventData),
      });
      return handleResponse<Event>(response);
    } catch (error) {
      return { error: "Failed to create event." };
    }
  },

  // Update event
  async updateEvent(
    id: string,
    eventData: Partial<Event>
  ): Promise<ApiResponse<Event>> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(eventData),
      });
      return handleResponse<Event>(response);
    } catch (error) {
      return { error: "Failed to update event." };
    }
  },

  // Delete event
  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return { error: error.detail || "Failed to delete event" };
      }
      return {};
    } catch (error) {
      return { error: "Failed to delete event." };
    }
  },

  // RSVP to an event
  async rsvpToEvent(
    eventId: string,
    status: "going" | "not_going" | "maybe"
  ): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/rsvps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ event_id: eventId, status }),
      });
      return handleResponse<void>(response);
    } catch (error) {
      return { error: "Failed to update RSVP status." };
    }
  },

  // Get user's RSVP status for an event
  async getUserRsvp(eventId: string): Promise<ApiResponse<{ status: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/rsvps/event/${eventId}`, {
        credentials: "include",
      });
      return handleResponse<{ status: string }>(response);
    } catch (error) {
      return { error: "Failed to fetch RSVP status." };
    }
  },
};
