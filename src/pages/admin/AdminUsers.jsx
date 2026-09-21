import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { useDebounce } from '../../hooks/useDebounce';
import { Users, Search, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AdminUsers = () => {
  const { success, error } = useToast();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 350);

  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        page,
        limit: 15
      });
      setUsers(res.data || []);
      if (res.meta) {
        setPagination({
          total: res.meta.total,
          totalPages: res.meta.totalPages
        });
      }
    } catch (err) {
      error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, roleFilter, statusFilter, page]);

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!window.confirm(`Are you sure you want to mark this user as ${nextStatus}?`)) return;

    try {
      await adminService.updateUserStatus(userId, nextStatus);
      success(`User account successfully marked as ${nextStatus}. Audit log recorded.`);
      fetchUsers();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Users className="w-8 h-8 text-teal-700" aria-hidden="true" />
          User Account Management
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Search registered caregivers, partner representatives, and review account standing.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            aria-label="Search users"
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Roles' },
              { value: 'PARENT', label: 'Parents' },
              { value: 'NGO', label: 'NGO Representatives' },
              { value: 'GOVERNMENT', label: 'Gov Officials' },
              { value: 'ADMIN', label: 'Administrators' }
            ]}
          />
        </div>

        <div className="w-full sm:w-44">
          <Select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'SUSPENDED', label: 'Suspended' }
            ]}
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading user directory..." count={4} />
      ) : users.length === 0 ? (
        <EmptyState
          title="No users match search criteria"
          description="Try broadening your search term or clearing the role filters."
          icon={Users}
        />
      ) : (
        <>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">User</th>
                    <th scope="col" className="px-6 py-3.5">Role</th>
                    <th scope="col" className="px-6 py-3.5">Organization</th>
                    <th scope="col" className="px-6 py-3.5">Status</th>
                    <th scope="col" className="px-6 py-3.5">Joined</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isSuspended = u.status === 'SUSPENDED';
                    const joined = new Date(u.createdAt).toLocaleDateString();

                    return (
                      <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-slate-400 text-[11px]">{u.email}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {u.organizationId?.name || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={isSuspended ? 'suspended' : 'verified'} size="sm">
                            {u.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                          {joined}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {u.role !== 'ADMIN' && (
                            <Button
                              variant={isSuspended ? 'outline' : 'danger'}
                              size="sm"
                              onClick={() => handleToggleStatus(u._id, u.status)}
                            >
                              {isSuspended ? 'Reactivate' : 'Suspend'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
};
