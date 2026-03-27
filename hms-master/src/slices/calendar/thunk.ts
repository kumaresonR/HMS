import { createAsyncThunk } from "@reduxjs/toolkit";

// Dummy data for events and categories
const dummyEvents = [
  { id: "1", title: "Meeting with Team", date: "2024-12-01", description: "Discuss project updates" },
  { id: "2", title: "Client Presentation", date: "2024-12-05", description: "Present new features" },
  { id: "3", title: "Team Outing", date: "2024-12-10", description: "Celebrate project completion" },
];

const dummyCategories = [
  { id: "1", name: "Work" },
  { id: "2", name: "Personal" },
  { id: "3", name: "Birthday" },
];

const dummyUpcomingEvent = { id: "1", title: "Meeting with Team", date: "2024-12-01" };

export const getEvents = createAsyncThunk("calendar/getEvents", async () => {
  return dummyEvents; // Returning dummy events data
});

export const addNewEvent = createAsyncThunk("calendar/addNewEvent", async (event: any) => {
  return { ...event, id: (dummyEvents.length + 1).toString() }; // Mock new event with auto-generated ID
});

export const updateEvent = createAsyncThunk("calendar/updateEvent", async (event: any) => {
  const updatedEvent = { ...event }; 
  const eventIndex = dummyEvents.findIndex((e) => e.id === event.id);
  if (eventIndex !== -1) {
    dummyEvents[eventIndex] = updatedEvent;
  }
  return updatedEvent;
});

export const deleteEvent = createAsyncThunk("calendar/deleteEvent", async (eventId: string) => {
  const index = dummyEvents.findIndex((event) => event.id === eventId);
  if (index !== -1) {
    dummyEvents.splice(index, 1);
  }
  return eventId;
});

export const getCategories = createAsyncThunk("calendar/getCategories", async () => {
  return dummyCategories;
});

export const getUpCommingEvent = createAsyncThunk("calendar/getUpCommingEvent", async () => {
  return dummyUpcomingEvent;
});

export const resetCalendar = createAsyncThunk("calendar/resetCalendar", async () => {
  return {};
});
