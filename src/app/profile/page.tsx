'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/lib/useAuth';
import { supabase, getUserProfile } from '@/lib/supabase';
import TagInput from '@/components/TagInput';

interface Profile {
  id: string;
  name: string;
  neighborhood: string;
  bio: string;
  skills_have: string[];
  skills_need: string[];
  avatar_url: string | null;
}

function ProfileContent() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileId = searchParams.get('id');
  const isOwnProfile = !profileId || profileId === user?.id;

  useEffect(() => {
    // If no profileId and not logged in, redirect to login
    if (!authLoading && !user && !profileId) {
      router.push('/auth/login');
      return;
    }

    if (user || profileId) {
      loadProfile();
    }
  }, [user, authLoading, router, profileId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const targetUserId = profileId || user?.id;
      if (!targetUserId) throw new Error('No user ID available');

      const profileData = await getUserProfile(targetUserId);
      setProfile(profileData);
      setFormData(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (
    type: 'skills_have' | 'skills_need',
    skills: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: skills,
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          neighborhood: formData.neighborhood,
          bio: formData.bio,
          skills_have: formData.skills_have,
          skills_need: formData.skills_need,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, ...formData } as Profile);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center text-red-600">
          Profile not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {isOwnProfile ? 'My Profile' : `${profile.name}'s Profile`}
          </h1>
          {isOwnProfile && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Avatar and Basic Info */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                {profile.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                {editing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your neighborhood"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {profile.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      📍 {profile.neighborhood}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
            {editing ? (
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tell us about yourself"
              ></textarea>
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {profile.bio || (
                  <span className="text-gray-500 italic">
                    {isOwnProfile ? 'No bio added yet' : 'No bio available'}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Skills Have Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Skills I Have
            </h3>
            {editing ? (
              <TagInput
                tags={formData.skills_have || []}
                onTagsChange={(skills) =>
                  handleSkillsChange('skills_have', skills)
                }
                placeholder="Add a skill and press Enter"
                label=""
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills_have && profile.skills_have.length > 0 ? (
                  profile.skills_have.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    {isOwnProfile ? 'No skills added yet' : 'No skills listed'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Skills Need Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Skills I Need
            </h3>
            {editing ? (
              <TagInput
                tags={formData.skills_need || []}
                onTagsChange={(skills) =>
                  handleSkillsChange('skills_need', skills)
                }
                placeholder="Add a skill and press Enter"
                label=""
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills_need && profile.skills_need.length > 0 ? (
                  profile.skills_need.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      ? {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    {isOwnProfile ? 'No skills needed yet' : 'No skills needed'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(profile);
                }}
                disabled={saving}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Message Button for Other User's Profile */}
          {!isOwnProfile && (
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
              Message {profile.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
