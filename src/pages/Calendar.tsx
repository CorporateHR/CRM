import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useLeads } from '../context/LeadsContext';
import LeadDetailsModal from '../components/LeadDetailsModal';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';

export default function Calendar() {
  const { leads } = useLeads();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('dayGridMonth');

  const events = leads.map(lead => ({
    id: lead.id,
    title: `${lead.title} - ${lead.company}`,
    start: lead.date,
    backgroundColor: getStatusColor(lead.status),
    borderColor: getStatusColor(lead.status),
    extendedProps: {
      ...lead,
      value: lead.value,
      status: lead.status,
      description: lead.description,
    },
  }));

  function getStatusColor(status: string) {
    const colors = {
      new: '#60A5FA',
      contacted: '#34D399',
      qualified: '#FBBF24',
      proposal: '#F87171',
      negotiation: '#A78BFA',
      closed: '#10B981',
    };
    return colors[status as keyof typeof colors] || '#9CA3AF';
  }

  const handleEventClick = (info: any) => {
    setSelectedLead(info.event.extendedProps);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Calendar</h1>
            <p className="text-gray-600">View and manage your leads in a calendar view</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50">
              <Filter className="h-5 w-5 mr-2 text-gray-400" />
              Filter
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Add Event
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          eventContent={(eventInfo) => (
            <div className="p-1 cursor-pointer hover:opacity-90 transition-opacity">
              <div className="font-medium truncate">{eventInfo.event.title}</div>
              <div className="text-sm opacity-75">
                ${eventInfo.event.extendedProps.value.toLocaleString()}
              </div>
            </div>
          )}
          height="auto"
          aspectRatio={1.8}
          eventClick={handleEventClick}
          dayMaxEvents={3}
          nowIndicator={true}
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          slotDuration="00:30:00"
          allDaySlot={false}
          stickyHeaderDates={true}
          viewDidMount={(info) => setView(info.view.type)}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short'
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }}
          eventClassNames="rounded-md shadow-sm transition-transform hover:scale-[1.02]"
        />
      </div>

      <LeadDetailsModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
}