import { gapi } from "gapi-script"
import { VITE_GOOGLE_CALENDAR_API, VITE_GOOGLE_CALENDAR_CLIENT_ID } from "@/credentials"
const CLIENT_ID = VITE_GOOGLE_CALENDAR_CLIENT_ID
const API_KEY = VITE_GOOGLE_CALENDAR_API
const SCOPES = "https://www.googleapis.com/auth/calendar.events"

export const initGoogleCalendar = () => {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      scope: SCOPES,
    })
  })
}

export const signIn = async () => {
  const auth = gapi.auth2.getAuthInstance()
  await auth.signIn()
}

export const createGoogleCalendarEvent = async (event) => {
  const response = await gapi.client.calendar.events.insert({
    calendarId: "primary",
    resource: event,
  })
  return response.result
}

export const listGoogleCalendarEvents = async () => {
  const response = await gapi.client.calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    showDeleted: false,
    singleEvents: true,
    orderBy: "startTime",
  })
  return response.result.items
}
