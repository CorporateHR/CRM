import React, { useState, useEffect } from 'react';
import { useLeads } from '../context/LeadsContext';
import Modal from './Modal';
import { Calendar, DollarSign } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface ContactLeadsModalProps {
  contactId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactLeadsModal({ contactId, isOpen, onClose }: ContactLeadsModalProps) {
  const { getContactLeads } = useLeads();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const contactLeads = await getContactLeads(contactId);
        setLeads(contactLeads);
      } catch (error) {
        console.error('Error fetching contact leads:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchLeads();
    }
  }, [contactId, isOpen, getContactLeads]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact's Leads">
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{lead.title}</h3>
                  <p className="text-sm text-gray-600">{lead.company}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'contacted' ? 'bg-green-100 text-green-800' :
                    lead.status === 'qualified' ? 'bg-yellow-100 text-yellow-800' :
                    lead.status === 'proposal' ? 'bg-red-100 text-red-800' :
                    lead.status === 'negotiation' ? 'bg-purple-100 text-purple-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {lead.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${lead.value.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(lead.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}