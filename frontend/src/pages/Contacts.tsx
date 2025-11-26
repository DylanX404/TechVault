import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ListHeader } from '../components/ListHeader';
import { EmptyOrgState } from '../components/EmptyOrgState';
import { useOrganization } from '../contexts/OrganizationContext';
import { contactAPI } from '../services/core';
import { Contact } from '../types/core';
import { Users, Trash2, Edit, ChevronRight } from 'lucide-react';

export const Contacts: React.FC = () => {
  const navigate = useNavigate();
  const { selectedOrg } = useOrganization();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedOrg) {
      fetchContacts();
    } else {
      setContacts([]);
      setLoading(false);
    }
  }, [selectedOrg]);

  const fetchContacts = async () => {
    if (!selectedOrg) return;

    try {
      setLoading(true);
      const response = await contactAPI.byOrganization(selectedOrg.id.toString());
      const data: Contact[] = Array.isArray(response.data)
        ? response.data
        : ((response.data as any)?.results || []);
      setContacts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this contact?')) {
      try {
        await contactAPI.delete(id);
        setContacts(contacts.filter(c => c.id !== id));
      } catch (err) {
        setError('Failed to delete contact');
      }
    }
  };

  return (
    <div className="space-y-6">
      <ListHeader
        title="Contacts"
        onAddClick={() => navigate('/contacts/new')}
        onSearch={() => {}}
        searchPlaceholder="Search contacts..."
      />

      {!selectedOrg ? (
        <EmptyOrgState />
      ) : (
        <>
          {error && <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-200">{error}</div>}

          {loading ? (
        <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>
      ) : contacts.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No contacts found</p>
          <Button onClick={() => navigate('/contacts/new')} className="bg-blue-600 hover:bg-blue-700">Create First Contact</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contacts.map(contact => (
            <Card key={contact.id} className="p-6 hover:border-blue-500 cursor-pointer group" onClick={() => navigate(`/contacts/${contact.id}`)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">{contact.full_name}</h3>
                  {contact.title && <p className="text-gray-400 text-sm">{contact.title}</p>}
                  <p className="text-gray-400 text-sm">{contact.organization_name}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-400">
                    <a href={`mailto:${contact.email}`} className="hover:text-blue-400">{contact.email}</a>
                    {contact.phone && <span>{contact.phone}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={(e) => { e.stopPropagation(); navigate(`/contacts/${contact.id}/edit`); }} className="p-2 hover:bg-gray-700"><Edit className="w-4 h-4" /></Button>
                  <Button onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }} className="p-2 hover:bg-red-900/20 text-red-400"><Trash2 className="w-4 h-4" /></Button>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>
          )}
        </>
      )}
    </div>
  );
};
