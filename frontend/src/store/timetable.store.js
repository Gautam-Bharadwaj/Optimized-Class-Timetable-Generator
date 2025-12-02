import { create } from 'zustand';

export const useTimetableStore = create((set) => ({
    timetables: [],
    currentTimetable: null,
    setTimetables: (timetables) => set({ timetables }),
    setCurrentTimetable: (currentTimetable) => set({ currentTimetable }),
}));
