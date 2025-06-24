"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const ExperienceSection = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [email, setEmail] = React.useState("")
  const [subject, setSubject] = React.useState("")

  const handleBooking = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          email,
          subject,
        }),
      });

      if (response.ok) {
        alert("Appointment request sent! We will be in touch via email.");
        setEmail("");
        setSubject("");
      } else {
        alert("There was an error sending your request. Please try again.");
      }
    } catch (error) {
      console.error('Failed to send appointment request:', error);
      alert("There was an error sending your request. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 font-primary flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md mx-auto bg-slate-800/50 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <h1 className="text-4xl font-extralight text-center text-slate-50 mb-8 animate-fade-in-down">
          Book an Appointment
        </h1>
        <div className="text-center mt-8">
          <a
            href="https://calendly.com/allenjosejames007"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-xs mx-auto"
          >
            <Button
              type="button"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span role="img" aria-label="calendar">📅</span> Book via Calendly
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;