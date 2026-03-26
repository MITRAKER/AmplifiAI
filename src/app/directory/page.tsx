'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  name: string;
  neighborhood: string;
  bio: string;
  skills_have: string[];
  skills_need: string[];
}

export default function DirectoryPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNeighborhood, setFilterNeighborhood] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;

      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      // Set demo users if fetch fails
      setUsers([
        {
          id: '1',
          name: 'Sarah Johnson',
          neighborhood: 'Downtown',
          bio: 'Community coordinator and event organizer',
          skills_have: ['Event Planning', 'Community Outreach'],
          skills_need: ['Gardening', 'Web Design'],
        },
        {
          id: '2',
          name: 'Mike Chen',
          neighborhood: 'Midtown',
          bio: 'Local business owner and entrepreneur',
          skills_have: ['Business Strategy', 'Marketing'],
          skills_need: ['Legal Advice', 'Accounting'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNeighborhood =
      !filterNeighborhood || user.neighborhood === filterNeighborhood;
    return matchesSearch && matchesNeighborhood;
  });

  const neighborhoods = Array.from(
    new Set(users.map((user) => user.neighborhood))
  ).sort();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Neighborhood Directory
      </h1>
      <p className="text-gray-600 mb-8">
        Connect with your neighbors and local community members
      </p>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name or bio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={filterNeighborhood}
          onChange={(e) => setFilterNeighborhood(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All neighborhoods</option>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg mb-6">
          {error} - Showing sample users for demo purposes
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-600">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-gray-600">
          No users found matching your search
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header with Avatar */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-24 relative">
                <div className="absolute -bottom-6 left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="pt-10 px-6 pb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  📍 {user.neighborhood}
                </p>

                {user.bio && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {user.bio}
                  </p>
                )}

                {/* Skills Preview */}
                <div className="mb-4">
                  {user.skills_have && user.skills_have.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Can offer:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {user.skills_have.slice(0, 2).map((skill, i) => (
                          <span
                            key={i}
                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {user.skills_have.length > 2 && (
                          <span className="text-xs text-gray-600">
                            +{user.skills_have.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {user.skills_need && user.skills_need.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Looking for:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {user.skills_need.slice(0, 2).map((skill, i) => (
                          <span
                            key={i}
                            className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {user.skills_need.length > 2 && (
                          <span className="text-xs text-gray-600">
                            +{user.skills_need.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/profile?id=${user.id}`}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-semibold transition-colors text-center"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/messages?userId=${user.id}&userName=${encodeURIComponent(user.name)}`}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 text-sm font-semibold transition-colors text-center"
                  >
                    Message
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
