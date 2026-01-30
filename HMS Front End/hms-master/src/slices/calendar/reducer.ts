import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for Event and Category
export interface Event {
  id: number;
  title: string;
  date: string;
}

export interface Category {
  id: number;
  name: string;
}

interface CalendarState {
  events: Event[];
  categories: Category[];
  upcommingevents: Event[];
  error: Record<string, any> | null;
}

// Dummy data for events, categories, and upcoming events
const dummyEvents: Event[] = [
  { id: 1, title: "Event 1", date: "2024-12-01" },
  { id: 2, title: "Event 2", date: "2024-12-10" },
];

const dummyCategories: Category[] = [
  { id: 1, name: "Category 1" },
  { id: 2, name: "Category 2" },
];

const dummyUpcomingEvents: Event[] = [
  { id: 1, title: "Upcoming Event 1", date: "2024-12-01" },
  { id: 2, title: "Upcoming Event 2", date: "2024-12-05" },
];

const initialState: CalendarState = {
  events: [],
  categories: [],
  upcommingevents: [],
  error: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    getEvents: (state) => {
      state.events = dummyEvents;
    },
    addNewEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      state.events = state.events.map((event) =>
        event.id === action.payload.id ? { ...event, ...action.payload } : event
      );
    },
    deleteEvent: (state, action: PayloadAction<number>) => {
      state.events = state.events.filter((event) => event.id !== action.payload);
    },
    getCategories: (state) => {
      state.categories = dummyCategories;
    },
    getUpCommingEvent: (state) => {
      state.upcommingevents = dummyUpcomingEvents;
    },
    resetCalendar: (state) => {
      state.events = [];
      state.categories = [];
      state.upcommingevents = [];
    },
  },
});

export const {
  getEvents,
  addNewEvent,
  updateEvent,
  deleteEvent,
  getCategories,
  getUpCommingEvent,
  resetCalendar,
} = calendarSlice.actions;

export default calendarSlice.reducer;
