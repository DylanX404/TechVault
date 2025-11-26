import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ListHeader } from '../components/ListHeader';
import { locationAPI } from '../services/core';
import { Location } from '../types/core';
import { MapPin, Trash2, Edit, ChevronRight } from 'lucide-react';

export const Locations: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const orgId = searchParams.get('org');

  useEffect(() => {
    fetchLocations();
  }, [orgId]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      let response;
      if (orgId) {
        response = await locationAPI.byOrganization(orgId);
        setLocations(Array.isArray(response.data) ? response.data : response.data.results);
      } else {
        response = await locationAPI.getAll();
        setLocations(response.data.results);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load locations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter locally for now
    if (query) {
      const filtered = locations.filter(loc =>
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.city.toLowerCase().includes(query.toLowerCase())
      );
      setLocations(filtered);
    } else {
      fetchLocations();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this location?')) {
      try {
        await locationAPI.delete(id);
        setLocations(locations.filter(loc => loc.id !== id));
      } catch (err) {
        setError('Failed to delete location');
      }
    }
  };

  return (
    <div className="space-y-6">
      <ListHeader
        title="Locations"
        onAddClick={() => navigate('/locations/new')}
        onSearch={handleSearch}
        searchPlaceholder="Search locations..."
      />

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-200">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">Loading locations...</p>
        </div>
      ) : locations.length === 0 ? (
        <Card className="p-8 text-center">
          <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No locations found</p>
          <Button onClick={() => navigate('/locations/new')} className="bg-blue-600 hover:bg-blue-700">
            Create First Location
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {locations.map(loc => (
            <Card
              key={loc.id}
              className="p-6 hover:border-blue-500 transition-colors cursor-pointer group"
              onClick={() => navigate(`/locations/${loc.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">
                      {loc.name}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{loc.organization_name}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <div>{loc.address}</div>
                    <div>{loc.city}, {loc.country}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/locations/${loc.id}/edit`);
                    }}
                    className="p-2 hover:bg-gray-700 text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(loc.id);
                    }}
                    className="p-2 hover:bg-red-900/20 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
