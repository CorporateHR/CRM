import React from 'react';
import { Calendar, DollarSign, Building2, User, Mail, Phone, Clock } from 'lucide-react';
import Modal from './Modal';

interface LeadDetailsModalProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadDetailsModal({ lead, isOpen, onClose }: LeadDetailsModalProps) {
  if (!lead) return null;

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-green-100 text-green-800',
    qualified: 'bg-yellow-100 text-yellow-800',
    proposal: 'bg-red-100 text-red-800',
    negotiation: 'bg-purple-100 text-purple-800',
    closed: 'bg-emerald-100 text-emerald-800',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{lead.title}</h3>
            <div className="flex items-center mt-2 text-gray-600">
              <Building2 className="h-4 w-4 mr-1" />
              <span>{lead.company}</span>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[lead.status as keyof typeof statusColors]}`}>
            {lead.status}
          </span>
        </div>

        {/* Value and Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-600 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-sm">Deal Value</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              ${lead.value.toLocaleString()}
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-600 mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">Created Date</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {new Date(lead.date).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>{lead.contact.name}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              <span>{lead.contact.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>{lead.contact.phone}</span>
            </div>
          </div>
        </div>

        {/* Next Follow-up */}
        {lead.nextFollowUp && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-600 mb-1">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Next Follow-up</span>
            </div>
            <span className="text-gray-900">
              {new Date(lead.nextFollowUp).toLocaleString()}
            </span>
          </div>
        )}

        {/* Description */}
        {lead.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p className="text-gray-600">{lead.description}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}