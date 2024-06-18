"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/firebaseConfig";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
const Calendar = () => {
  const [events, setEvents] = useState([{ title: "", date: "" }]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const handleAddEvent = async () => {
    if (newEventTitle && newEventDate) {
      setEvents([...events, { title: newEventTitle, date: newEventDate }]);
      const docRef = await addDoc(collection(db, `applications/calender`), {
        events,
      });
      setNewEventTitle("");
      setNewEventDate("");
      try {
        // Add the new event to Firestore
        const docRef = await addDoc(
          collection(db, "applications/calendar/events"),
          {
            title: newEventTitle,
            date: newEventDate,
          }
        );
        setEvents([...events, { title: newEventTitle, date: newEventDate }]);
        setNewEventTitle("");
        setNewEventDate("");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };
  useEffect(() => {
    const q = query(collection(db, "applications/calendar/events"));
    const unsub = onSnapshot(q, (snapshot) => {
      const eventsData: any = snapshot.docs.map((doc) => doc.data());
      setEvents(eventsData);
      console.log(eventsData);
    });
    return () => unsub();
  }, []);
  return (
    <div className="w-full full">
      <div className="ml-[20px] xl:ml-[42px] flex items-center pt-[45px] gap-4">
        <Link href="/application">
          <MoveLeft className="size-6 text-primary" />
        </Link>
        <h1 className="text-lg text-[#244469]">Applications/Calendar</h1>
      </div>
      <div className="flex bg-white w-full justify-between mt-[30px] xl:mt-[55px] py-[66px] pr-4 flex-col xl:flex-row">
        <div className="flex w-fit xl:w-[200px] gap-y-[17px] xl:pt-[63px] xl:flex-col">
          <Button className="bg-[#1B8FE3] w-full">All event</Button>
          <Button className="bg-[#4CAF50] w-full">Company's Event</Button>
          <Button className="bg-[#F15B64] w-full">Scheduled Event</Button>
        </div>
        <div className="bg-white w-full xl:w-[70%] h-[800px] border border-dotted border-[#5C5C5C] px-[24px] py-[10px] rounded-[20px]">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="border p-2 mr-2 rounded-lg"
            />
            <input
              type="date"
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
              className="border p-2 mr-2 rounded-lg"
            />
            <button
              onClick={handleAddEvent}
              className="bg-blue-500 text-white p-2 rounded-lg"
            >
              Add Event
            </button>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "today prev next",
              center: "title",
              end: "dayGridMonth timeGridWeek timeGridDay",
            }}
            events={events}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;