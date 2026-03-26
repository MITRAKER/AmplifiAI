'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { supabase } from '@/lib/supabase';

interface SignupItem {
  name: string;
  contribution: string;
}

interface PermitTask {
  id: string;
  task: string;
  completed: boolean;
}

const PERMIT_TASKS: PermitTask[] = [
  { id: 'contact', task: 'Contact city/county for permit requirements', completed: false },
  { id: 'liability', task: 'Arrange liability insurance', completed: false },
  { id: 'application', task: 'Submit permit application', completed: false },
  { id: 'approval', task: 'Receive permit approval', completed: false },
];

export default function BlockPartyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  // Step 1 - Legalities
  const [permitTasks, setPermitTasks] = useState<PermitTask[]>(PERMIT_TASKS);
  const [permitUrl, setPermitUrl] = useState('');

  // Step 2 - Funding
  const [paymentLink, setPaymentLink] = useState('');
  const [fundingTitle, setFundingTitle] = useState('');

  // Step 3 - Logistics
  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [signups, setSignups] = useState<SignupItem[]>([]);
  const [signupName, setSignupName] = useState('');
  const [signupContribution, setSignupContribution] = useState('');

  // Step 4 - Entertainment
  const vendors = [
    {
      category: '🎵 DJ Services',
      items: [
        { name: 'DJ Alex', description: 'Top 40 & Hip Hop', price: '$300-500' },
        { name: 'DJ Beats', description: 'Throwback Hits', price: '$250-400' },
        { name: 'DJ Sonic', description: 'All Genres', price: '$400-600' },
      ],
    },
    {
      category: '🍔 Catering',
      items: [
        { name: 'BBQ Masters', description: 'Ribs, Chicken, Brisket', price: '$20/person' },
        { name: 'Taco Tuesday Crew', description: 'Tacos & Burritos', price: '$15/person' },
        { name: 'Pizza Palace', description: 'Wood-fired Pizza', price: '$18/person' },
      ],
    },
    {
      category: '🎪 Entertainment',
      items: [
        { name: 'BounceHouse Pro', description: 'Giant Obstacle Course', price: '$150' },
        { name: 'Face Paint Artist', description: 'Professional Face Painting', price: '$100' },
        { name: 'Photo Booth', description: 'Props & Instant Prints', price: '$200' },
      ],
    },
  ];

  const togglePermitTask = (taskId: string) => {
    setPermitTasks(
      permitTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddSignup = () => {
    if (!signupName.trim() || !signupContribution.trim()) {
      alert('Please fill in both name and contribution');
      return;
    }
    setSignups([...signups, { name: signupName, contribution: signupContribution }]);
    setSignupName('');
    setSignupContribution('');
  };

  const handleRemoveSignup = (index: number) => {
    setSignups(signups.filter((_, i) => i !== index));
  };

  const handleCreateParty = async () => {
    if (!user) return;
    if (!title.trim() || !neighborhood.trim()) {
      alert('Please enter a title and neighborhood');
      return;
    }

    setIsCreating(true);
    try {
      const { error } = await supabase.from('party_projects').insert([
        {
          creator_id: user.id,
          title,
          neighborhood,
          permit_done: permitTasks.every((t) => t.completed),
          funding_link: paymentLink || null,
          signups: JSON.stringify(signups),
          vendors: JSON.stringify(vendors.map((v) => v.category)),
        },
      ]);

      if (error) throw error;

      alert('Block party created successfully!');
      router.push('/');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create block party');
    } finally {
      setIsCreating(false);
    }
  };

  const progressPercentage = (currentStep / 4) * 100;
  const completedTasks = permitTasks.filter((t) => t.completed).length;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Block Party Hub</h1>
            <p className="text-gray-600 font-semibold">Step {currentStep} of 4</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Step 1: Legalities */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1: Legalities</h2>
              <p className="text-gray-600 mb-8">
                Ensure your block party has the proper permits and insurance
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 text-sm">
                    ℹ️ Check off each item as you complete it. This helps keep your event legal and safe.
                  </p>
                </div>

                {permitTasks.map((task) => (
                  <label
                    key={task.id}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => togglePermitTask(task.id)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span
                      className={`ml-4 text-lg ${
                        task.completed
                          ? 'line-through text-gray-500'
                          : 'text-gray-900 font-medium'
                      }`}
                    >
                      {task.task}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City Permit URL
                </label>
                <input
                  type="url"
                  value={permitUrl}
                  onChange={(e) => setPermitUrl(e.target.value)}
                  placeholder="https://example.com/permit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Optional: Link to where neighbors can check permit status
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Next: Funding →
                </button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-4">
                Permits completed: <span className="font-bold">{completedTasks}/4</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Funding */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Funding</h2>
              <p className="text-gray-600 mb-8">
                Share a payment link for neighbors to contribute to the party
              </p>

              <div className="space-y-6 mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 text-sm">
                    💡 Add your Stripe or Venmo link to collect contributions from neighbors
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Link (Stripe/Venmo/GoFundMe)
                  </label>
                  <input
                    type="url"
                    value={paymentLink}
                    onChange={(e) => setPaymentLink(e.target.value)}
                    placeholder="https://venmo.com/... or https://stripe.com/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Funding Campaign Title
                  </label>
                  <input
                    type="text"
                    value={fundingTitle}
                    onChange={(e) => setFundingTitle(e.target.value)}
                    placeholder="e.g., 'Help Fund Our Neighborhood Block Party!'"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {paymentLink && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2 font-semibold">Shareable Link:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={paymentLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(paymentLink);
                          alert('Link copied to clipboard!');
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Next: Logistics →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Logistics */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 3: Logistics</h2>
              <p className="text-gray-600 mb-8">
                Set up your party and collect neighbor signups for contributions
              </p>

              <div className="space-y-6 mb-8">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-900 text-sm">
                    📋 Add your party details and collect what neighbors will bring
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Party Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., 'Summer Block Party 2024'"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Neighborhood *
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g., 'Downtown', 'Midtown', 'Westside'"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Neighbor Signups</h3>

                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSignup()}
                        placeholder="Neighbor's name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        What will you bring?
                      </label>
                      <input
                        type="text"
                        value={signupContribution}
                        onChange={(e) => setSignupContribution(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSignup()}
                        placeholder="e.g., 'Hamburger buns', 'Folding tables', 'Speaker'"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleAddSignup}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-semibold transition-colors"
                    >
                      + Add Signup
                    </button>
                  </div>

                  {signups.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Signups ({signups.length})
                      </h4>
                      <div className="space-y-2">
                        {signups.map((signup, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center bg-white p-3 rounded border border-gray-200"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{signup.name}</p>
                              <p className="text-sm text-gray-600">{signup.contribution}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveSignup(idx)}
                              className="text-red-600 hover:text-red-800 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Next: Entertainment →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Entertainment */}
        {currentStep === 4 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 4: Entertainment</h2>
              <p className="text-gray-600 mb-8">
                Browse local vendors to make your party unforgettable
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
                <p className="text-orange-900 text-sm">
                  🎪 Browse trusted local vendors in your area. Contact them directly to book!
                </p>
              </div>

              {vendors.map((vendorGroup, groupIdx) => (
                <div key={groupIdx} className="mb-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {vendorGroup.category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {vendorGroup.items.map((vendor, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                      >
                        <h4 className="font-bold text-lg text-gray-900 mb-2">
                          {vendor.name}
                        </h4>
                        <p className="text-gray-700 mb-3">{vendor.description}</p>
                        <p className="font-semibold text-blue-600 mb-4">{vendor.price}</p>
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                          Get Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-4 mt-12">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleCreateParty}
                  disabled={isCreating}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:bg-gray-400"
                >
                  {isCreating ? 'Creating Party...' : '🎉 Create Block Party'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
