import React, { createContext, useContext, useState } from 'react';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'New' | 'In Progress' | 'Converted' | 'Lost';
  source: string;
  assignedTo?: string;
  createdAt: string;
  value?: number;
  nextFollowUp?: string;
}

interface LeadsContextType {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  getContactLeads: (contactId: string) => Lead[];
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      status: 'New',
      source: 'Website',
      assignedTo: 'Sales Team',
      createdAt: new Date().toISOString(),
      value: 50000,
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '987-654-3210',
      status: 'In Progress',
      source: 'Referral',
      assignedTo: 'Sales Manager',
      createdAt: new Date().toISOString(),
      value: 75000,
      nextFollowUp: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLead = (lead: Omit<Lead, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const newLead: Lead = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...lead
      };
      setLeads(prevLeads => [...prevLeads, newLead]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add lead');
    } finally {
      setLoading(false);
    }
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    try {
      setLoading(true);
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === id ? { ...lead, ...updates } : lead
        )
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = (id: string) => {
    try {
      setLoading(true);
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete lead');
    } finally {
      setLoading(false);
    }
  };

  const getContactLeads = (contactId: string): Lead[] => {
    try {
      setLoading(true);
      return leads.filter(lead => lead.assignedTo === contactId);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get contact leads');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <LeadsContext.Provider value={{ 
      leads, 
      loading, 
      error, 
      addLead, 
      updateLead, 
      deleteLead,
      getContactLeads
    }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
}