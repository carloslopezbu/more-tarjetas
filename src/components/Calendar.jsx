import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  format,
  startOfWeek,
  addDays,
  startOfDay,
  addHours,
  isSameDay
} from "date-fns"
import { initGoogleCalendar, signIn, createGoogleCalendarEvent, listGoogleCalendarEvents } from "@/api/googleCalendar"

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [newEvent, setNewEvent] = useState({ title: "", description: "", time: "" })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDateTime, setSelectedDateTime] = useState(null)

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i))

  useEffect(() => {
    initGoogleCalendar()
    fetchGoogleCalendarEvents()
  }, [])

  const fetchGoogleCalendarEvents = async () => {
    try {
      const googleEvents = await listGoogleCalendarEvents()
      const formattedEvents = googleEvents.map((event) => ({
        title: event.summary,
        description: event.description || "",
        date: new Date(event.start.dateTime || event.start.date),
      }))
      setEvents(formattedEvents)
    } catch (error) {
      console.error("Error fetching Google Calendar events:", error)
    }
  }

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) return

    let eventDate
    if (selectedDateTime) {
      eventDate = new Date(selectedDateTime)
    } else if (newEvent.time.trim()) {
      const [hour, minute] = newEvent.time.split(":").map(Number)
      eventDate = addHours(startOfDay(currentDate), hour).setMinutes(minute)
    } else {
      return
    }

    const newEventObject = { ...newEvent, date: eventDate }
    setEvents([...events, newEventObject])

    // Sync with Google Calendar
    try {
      await createGoogleCalendarEvent({
        summary: newEvent.title,
        description: newEvent.description,
        start: { dateTime: eventDate.toISOString() },
        end: { dateTime: addHours(eventDate, 1).toISOString() }, // Default 1-hour duration
      })
    } catch (error) {
      console.error("Error creating Google Calendar event:", error)
    }

    setNewEvent({ title: "", description: "", time: "" })
    setSelectedDateTime(null)
    setDialogOpen(false)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-700">📅 My Calendar</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
            ← Previous
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
            Next →
          </Button>
          <Button variant="outline" onClick={signIn}>Sign In with Google</Button>
        </div>
      </header>

      {/* Week Header */}
      <div className="grid grid-cols-7 bg-white rounded-t-md shadow border">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="border-r p-3 text-center">
            <div className="text-sm text-gray-500">{format(day, "EEEE")}</div>
            <div className="text-md font-medium text-gray-800">{format(day, "MMM d")}</div>
          </div>
        ))}
      </div>

      {/* Hour Grid */}
      <div className="grid grid-cols-7 border-l border-r border-b bg-white shadow rounded-b-md overflow-hidden">
        {daysOfWeek.map((day, dayIndex) => (
          <div key={dayIndex} className="border-r relative">
            {/* Hour Blocks */}
            {Array.from({ length: 24 }).map((_, hour) => {
              const cellTime = new Date(day)
              cellTime.setHours(hour, 0, 0, 0)

              return (
                <div
                  key={hour}
                  className="h-[50px] border-t px-2 text-xs text-gray-400 hover:bg-blue-50 cursor-pointer relative"
                  onClick={() => {
                    setSelectedDateTime(cellTime)
                    setNewEvent({
                      title: "",
                      description: "",
                      time: format(cellTime, "HH:mm")
                    })
                    setDialogOpen(true)
                  }}
                >
                  <div className="absolute left-1 top-1 text-[10px] text-gray-300">{hour}:00</div>
                </div>
              )
            })}

            {/* Render events */}
            {events
              .filter((event) => isSameDay(event.date, day))
              .map((event, i) => {
                const eventDate = new Date(event.date)
                const topOffset = eventDate.getHours() * 50 + (eventDate.getMinutes() / 60) * 50
                return (
                  <div
                    key={i}
                    className="absolute left-2 right-2 bg-blue-500 text-white rounded-md p-2 text-xs shadow-md"
                    style={{ top: `${topOffset}px` }}
                  >
                    <div className="font-semibold">{event.title}</div>
                    {event.description && <div className="text-white/80 text-[11px]">{event.description}</div>}
                  </div>
                )
              })}
          </div>
        ))}
      </div>

      {/* Manual trigger */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDateTime
                ? `Create event on ${format(selectedDateTime, "EEEE, MMM d - HH:mm")}`
                : "Add Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <Button onClick={handleAddEvent} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Save Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
