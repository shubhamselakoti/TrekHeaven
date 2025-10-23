import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import LoadingScreen from '../../components/ui/LoadingScreen';
import Button from '../../components/ui/Button';
import { getAllRegistrations } from '../../services/trekService';


const TrekRegistrationsAdmin = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const data = await getAllRegistrations();
        setRegistrations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch trek registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  // Calculate total team members for all registrations (exclude cancelled)
  const totalTeamMembers = Array.isArray(registrations)
    ? registrations.reduce((sum, reg) => sum + ((reg.status !== 'cancelled') ? (reg.teamMembers?.length || 0) : 0), 0)
    : 0;

  // Group registrations by trek
  const treksMap = {};
  (Array.isArray(registrations) ? registrations : []).forEach(reg => {
    if (reg.trek && reg.trek._id) {
      if (!treksMap[reg.trek._id]) {
        treksMap[reg.trek._id] = {
          trek: reg.trek,
          registrations: [],
          totalTeam: 0,
          totalTeams: 0
        };
      }
      treksMap[reg.trek._id].registrations.push(reg);
      // Only add to totalTeam and totalTeams if not cancelled
      if (reg.status !== 'cancelled') {
        treksMap[reg.trek._id].totalTeam += reg.teamMembers?.length || 0;
        treksMap[reg.trek._id].totalTeams += 1;
      }
    }
  });
  const treks = Object.values(treksMap);

  if (loading) return <LoadingScreen />;
  if (error) return <div className="text-error p-4">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Trek Registrations Overview</h1>
      <div className="mb-4 text-gray-700 font-medium">Total Team Members (All Treks): <span className="text-primary-500 font-bold">{totalTeamMembers}</span></div>
      {treks.length === 0 ? (
        <div className="text-gray-500">No trek registrations found.</div>
      ) : (
        treks.map(({ trek, registrations, totalTeam, totalTeams }) => (
          <div key={trek._id} className="mb-8 border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-bold">{trek.title}</div>
                <div className="text-sm text-gray-500">{trek.location} | Start Dates: {Array.isArray(trek.startDate) ? trek.startDate.join(', ') : trek.startDate}</div>
              </div>
              <div className="mt-2 md:mt-0 text-sm text-gray-700">Total Teams: <span className="font-bold">{totalTeams}</span> | Total Members: <span className="font-bold">{totalTeam}</span></div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Account Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Team Members</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(reg => (
                      <tr key={reg._id} className={`border-b last:border-b-0 ${reg.status === 'cancelled' ? 'bg-orange-100 text-orange-700' : reg.status === 'confirmed' ? 'bg-green-100 text-green-700' : ''}`}>
                        <td className="px-4 py-2">{reg.user?.name || 'N/A'}</td>
                        <td className="px-4 py-2">{reg.user?.email || 'N/A'}</td>
                        <td className="px-4 py-2">{reg.teamMembers?.length || 0}</td>
                        <td className="px-4 py-2">{reg.status}</td>
                        <td className="px-4 py-2">{new Date(reg.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TrekRegistrationsAdmin;
