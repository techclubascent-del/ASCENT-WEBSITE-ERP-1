import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, Check } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  attendees: number;
  category: 'hackathon' | 'workshop' | 'meetup' | 'competition';
}

const SAMPLE_EVENTS: Event[] = [
  {
    id: 'evt-1',
    title: 'Winter HackSprint 2026',
    date: 'Dec 05, 2026',
    time: '48 Hours',
    location: 'Campus Mesh Protocol Lab',
    description: 'The annual 48-Hour Inter-Departmental Systems HackSprint. Form teams of up to 4 members and build next-gen distributed systems.',
    organizer: 'Ascent Hackathon Committee',
    attendees: 142,
    category: 'hackathon'
  },
  {
    id: 'evt-2',
    title: 'AI in Edge Computing Workshop',
    date: 'Oct 15, 2026',
    time: '2:00 PM - 5:00 PM',
    location: 'Advanced Computing Lab 4',
    description: 'A hands-on workshop covering low-latency distributed telemetry and neural inference runtimes on edge devices.',
    organizer: 'Ascent Technical Board',
    attendees: 45,
    category: 'workshop'
  },
  {
    id: 'evt-3',
    title: 'System Design Interview Prep',
    date: 'Oct 22, 2026',
    time: '6:00 PM - 8:00 PM',
    location: 'Virtual / Online',
    description: 'Weekly meetup to practice system design interviews with alumni and senior club members.',
    organizer: 'Ascent Placement Cell',
    attendees: 89,
    category: 'meetup'
  }
];

export function EventsView() {
  const [appliedEvents, setAppliedEvents] = useState<Record<string, boolean>>({});

  const handleApply = (eventId: string) => {
    setAppliedEvents(prev => ({
      ...prev,
      [eventId]: true
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">Events & Activities</h2>
          <p className="text-sm font-subheading text-[#8E9296]">Discover and register for upcoming club events, workshops, and hackathons.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SAMPLE_EVENTS.map(event => (
          <div key={event.id} className="bg-[#0C0D0E] border border-[#26282A] rounded-2xl p-6 shadow-xl flex flex-col h-full group hover:border-[#D4A373]/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A373]/5 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4">
              <span className="px-2.5 py-1 rounded-md bg-[#141517] border border-[#26282A] text-xs font-subheading text-[#D4A373] uppercase tracking-wider">
                {event.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#8E9296]">
                <Users className="w-3.5 h-3.5" />
                <span>{event.attendees} attending</span>
              </div>
            </div>
            
            <h3 className="text-xl font-heading font-bold text-white mb-2">{event.title}</h3>
            
            <div className="space-y-2 mb-4 flex-grow">
              <div className="flex items-center gap-2 text-sm text-[#8E9296]">
                <Calendar className="w-4 h-4 text-[#D4A373]" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#8E9296]">
                <Clock className="w-4 h-4 text-[#D4A373]" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#8E9296]">
                <MapPin className="w-4 h-4 text-[#D4A373]" />
                <span>{event.location}</span>
              </div>
            </div>
            
            <p className="text-sm text-[#8E9296] mb-6 line-clamp-3">
              {event.description}
            </p>
            
            <div className="mt-auto pt-4 border-t border-[#26282A] flex justify-between items-center">
              <span className="text-xs text-[#545454]">By {event.organizer}</span>
              <button 
                onClick={() => handleApply(event.id)}
                disabled={appliedEvents[event.id]}
                className={`px-4 py-2 rounded-lg text-sm font-subheading font-medium flex items-center gap-2 transition-all ${
                  appliedEvents[event.id]
                    ? 'bg-[#141517] text-[#D4A373] border border-[#D4A373]/30 cursor-not-allowed'
                    : 'bg-[#D4A373] text-black hover:bg-[#c49363] border border-transparent cursor-pointer shadow-md shadow-[#D4A373]/20'
                }`}
              >
                {appliedEvents[event.id] ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Registered</span>
                  </>
                ) : (
                  <>
                    <span>Register Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
