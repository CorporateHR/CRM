import React, { useState } from 'react';
import { useLeads } from '../context/LeadsContext';
import { useToast } from '../context/ToastContext';
import Papa from 'papaparse';
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';

interface CSVLead {
  title: string;
  company: string;
  value: string;
  status: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  nextFollowUp: string;
  description: string;
}

export default function BulkUpload() {
  const { addLead } = useLeads();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<CSVLead[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const downloadTemplate = () => {
    // Headers with field descriptions
    const headers = [
      'title (Required: Lead title, e.g., "New Software Project")',
      'company (Required: Company name, e.g., "Acme Corp")',
      'value (Required: Deal value in numbers, e.g., "5000")',
      'status (Optional: new, contacted, qualified, proposal, negotiation, closed)',
      'contactName (Required: Full name of contact person)',
      'contactEmail (Required: Valid email address)',
      'contactPhone (Optional: Phone number)',
      'nextFollowUp (Optional: Date in YYYY-MM-DD format)',
      'description (Optional: Additional details)'
    ];

    // Sample data row
    const sampleData = [
      'New Software Project',
      'Acme Corporation',
      '5000',
      'new',
      'John Smith',
      'john.smith@acme.com',
      '+1-123-456-7890',
      '2024-12-31',
      'Potential client interested in our enterprise solution'
    ];

    // Guidelines row
    const guidelines = [
      '(Enter lead title)',
      '(Enter company name)',
      '(Enter number only)',
      '(Enter one of: new, contacted, qualified, proposal, negotiation, closed)',
      '(Enter full name)',
      '(Enter valid email)',
      '(Enter phone number)',
      '(Enter date as YYYY-MM-DD)',
      '(Enter description)'
    ];

    // Combine headers, sample data, and guidelines
    const csvData = [
      headers,
      sampleData,
      guidelines,
      // Add an empty row for visual separation
      Array(headers.length).fill(''),
      // Add simple headers for actual data entry
      headers.map(h => h.split(' (')[0])
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show a helpful toast message
    showToast(
      'Template downloaded! Check the first rows for sample data and guidelines.',
      'success'
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedLeads = results.data.filter((lead: any) => 
          lead.title && lead.company && lead.contactEmail
        );
        setPreview(parsedLeads as CSVLead[]);
        setSelectedRows(parsedLeads.map((_, index) => index));
      },
      error: (error) => {
        showToast(`Error parsing CSV: ${error.message}`, 'error');
      }
    });
  };

  const validateLead = (lead: CSVLead): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!lead.title?.trim()) errors.push('Title is required');
    if (!lead.company?.trim()) errors.push('Company is required');
    if (!lead.contactName?.trim()) errors.push('Contact name is required');
    if (!lead.contactEmail?.trim()) errors.push('Contact email is required');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (lead.contactEmail && !emailRegex.test(lead.contactEmail)) {
      errors.push('Invalid email format');
    }

    // Validate value is a number
    if (!lead.value || isNaN(parseFloat(lead.value))) {
      errors.push('Value must be a valid number');
    }

    // Validate status
    const validStatuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed'];
    if (lead.status && !validStatuses.includes(lead.status.toLowerCase())) {
      errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Validate date format if provided
    if (lead.nextFollowUp) {
      const date = new Date(lead.nextFollowUp);
      if (isNaN(date.getTime())) {
        errors.push('Invalid next follow up date format. Use YYYY-MM-DD');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleBulkUpload = async () => {
    setUploading(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: { row: number; errors: string[] }[] = [];

    try {
      const rowsToUpload = selectedRows.length > 0 
        ? preview.filter((_, index) => selectedRows.includes(index))
        : preview;

      for (const [index, lead] of rowsToUpload.entries()) {
        const validation = validateLead(lead);
        
        if (!validation.isValid) {
          errorCount++;
          errors.push({ row: index + 1, errors: validation.errors });
          continue;
        }

        try {
          await addLead({
            title: lead.title.trim(),
            company: lead.company.trim(),
            value: parseFloat(lead.value),
            status: (lead.status?.toLowerCase() as any) || 'new',
            date: new Date().toISOString(),
            description: lead.description?.trim() || '',
            contact: {
              name: lead.contactName.trim(),
              email: lead.contactEmail.trim().toLowerCase(),
              phone: lead.contactPhone?.trim() || '',
            },
            nextFollowUp: lead.nextFollowUp 
              ? new Date(lead.nextFollowUp).toISOString()
              : undefined
          });
          successCount++;
        } catch (error) {
          console.error('Error adding lead:', error);
          errorCount++;
          errors.push({ 
            row: index + 1, 
            errors: [(error instanceof Error ? error.message : 'Unknown error')] 
          });
        }
      }

      if (successCount > 0) {
        showToast(
          `Successfully uploaded ${successCount} leads${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
          'success'
        );
        setPreview([]);
        setSelectedRows([]);
      } else if (errors.length > 0) {
        const errorMessage = errors.map(e => 
          `Row ${e.row}: ${e.errors.join(', ')}`
        ).join('\n');
        showToast(`Failed to upload leads:\n${errorMessage}`, 'error');
      } else {
        showToast('Failed to upload leads', 'error');
      }
    } catch (error) {
      showToast('An error occurred during upload', 'error');
      console.error('Bulk upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const toggleRowSelection = (index: number) => {
    setSelectedRows(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(prev => 
      prev.length === preview.length
        ? []
        : preview.map((_, index) => index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={downloadTemplate}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg inline-flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Template
          </button>
        </div>
        {preview.length > 0 && (
          <button
            onClick={handleBulkUpload}
            disabled={uploading || selectedRows.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Upload {selectedRows.length} Lead{selectedRows.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        )}
      </div>

      {preview.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === preview.length}
                      onChange={toggleAllRows}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.map((lead, index) => {
                  const validation = validateLead(lead);
                  const isValid = validation.isValid;
                  return (
                    <tr key={index} className={!isValid ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(index)}
                          onChange={() => toggleRowSelection(index)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          disabled={!isValid}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.title || <span className="text-red-500">Missing</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.company || <span className="text-red-500">Missing</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.value ? `$${parseFloat(lead.value).toLocaleString()}` : <span className="text-red-500">Missing</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'contacted' ? 'bg-green-100 text-green-800' :
                            lead.status === 'qualified' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'proposal' ? 'bg-red-100 text-red-800' :
                            lead.status === 'negotiation' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {lead.status || 'new'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{lead.contactName || <span className="text-red-500">Missing</span>}</div>
                          <div className="text-gray-500">{lead.contactEmail || <span className="text-red-500">Missing</span>}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isValid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="flex items-center text-red-500">
                            <AlertCircle className="h-5 w-5 mr-1" />
                            <span className="text-xs">Missing required fields</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}