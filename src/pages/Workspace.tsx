import { useState } from 'react';
import { useLeads, Lead } from '../context/LeadsContext';
import { useToast } from '../context/ToastContext';
import { Search, Filter, AlertCircle } from 'lucide-react';
import LeadForm from '../components/LeadForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Workspace() {
  const { leads, loading, updateLead } = useLeads();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'all'>('all');

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const getFollowUpStatus = (lead: Lead) => {
    if (!lead.nextFollowUp) return 'no-followup';

    const followUpDate = new Date(lead.nextFollowUp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (followUpDate < today) return 'overdue';
    if (
      followUpDate >= today && 
      followUpDate < tomorrow
    ) return 'today';
    return 'upcoming';
  };

  const filteredLeads = leads.filter(lead => {
    if (!lead) return false;  // Filter out null/undefined leads
    
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    // If either lead is null/undefined, move it to the end
    if (!a) return 1;
    if (!b) return -1;

    // If either lead lacks nextFollowUp, move it to the end
    if (!a.nextFollowUp) return 1;
    if (!b.nextFollowUp) return -1;

    return new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime();
  });

  const handleQuickUpdate = async (lead: Lead, status: Lead['status']) => {
    try {
      await updateLead(lead.id, { ...lead, status });
      showToast(`Lead status updated to ${status}`, 'success');
    } catch (error) {
      showToast('Failed to update lead status', 'error');
      console.error(error);
    }
  };

  const leadStatusOptions: Lead['status'][] = ['New', 'In Progress', 'Converted', 'Lost'];

  const statusFilterOptions = [
    { label: 'All Leads', value: 'all' },
    ...leadStatusOptions.map(status => ({ label: status, value: status }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Workspace</h1>
          <p className="text-gray-600">Manage your leads and follow-ups</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Lead['status'] | 'all')}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {statusFilterOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Leads Workspace */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="grid gap-6">
          {sortedLeads.map((lead) => {
            const followUpStatus = getFollowUpStatus(lead);
            
            return (
              <div
                key={lead.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                      <p className="text-gray-600">{lead.email}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize
                      ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'In Progress' ? 'bg-green-100 text-green-800' :
                        lead.status === 'Converted' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'Lost' ? 'bg-red-100 text-red-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Contact</div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-sm text-gray-600">{lead.email}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Next Follow-up</div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {lead.nextFollowUp && (
                          <div className={`flex items-center space-x-2 
                            ${followUpStatus === 'overdue' ? 'text-red-600' :
                              followUpStatus === 'today' ? 'text-green-600' :
                              'text-gray-600'
                            }`}>
                            <Filter className="h-4 w-4" />
                            <span>{new Date(lead.nextFollowUp).toLocaleString()}</span>
                            {followUpStatus === 'overdue' && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Update Details
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      {leadStatusOptions.filter(status => status !== lead.status).map(status => (
                        <button
                          key={status}
                          onClick={() => handleQuickUpdate(lead, status)}
                          className={`px-3 py-1 text-sm rounded-md hover:bg-${status.toLowerCase()}-100`}
                        >
                          Mark {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }}
        title="Update Lead"
      >
        <LeadForm
          initialData={selectedLead}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLead(null);
          }}
        />
      </Modal>
    </div>
  );
}