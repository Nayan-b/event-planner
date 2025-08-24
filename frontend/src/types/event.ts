export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  registered: number;
  image?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  start_time?: string;
  end_time?: string;
  price?: number;
  is_public?: boolean;
}

export interface EventFormData extends Omit<Event, 'id' | 'created_at' | 'updated_at'> {}

export interface RSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: 'going' | 'not_going' | 'maybe';
  created_at: string;
  updated_at: string;
}
