import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye } from 'lucide-react';
import { Card, Button, Badge, Loading } from '../components/Common';
import { formatDate, getStatusColor, classNames } from '../utils/helpers';
import kycService from '../services/kycService';
import toast from 'react-hot-toast';

const Applications = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await kycService.getApplications();
            setApplications(response.applications || response || []);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
            toast.error('Failed to load applications');
            // Demo data
            setApplications([
                { id: 'APP001', name: 'John Doe', email: 'john@example.com', createdAt: new Date(), status: 'approved', riskScore: 25 },
                { id: 'APP002', name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date(), status: 'review', riskScore: 55 },
                { id: 'APP003', name: 'Bob Wilson', email: 'bob@example.com', createdAt: new Date(), status: 'rejected', riskScore: 82 },
                { id: 'APP004', name: 'Alice Brown', email: 'alice@example.com', createdAt: new Date(), status: 'pending', riskScore: null },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = !search ||
            app.name?.toLowerCase().includes(search.toLowerCase()) ||
            app.email?.toLowerCase().includes(search.toLowerCase()) ||
            app.id?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <Loading fullScreen text="Loading applications..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
                    <p className="text-gray-500">Manage KYC verification applications</p>
                </div>
                <Button onClick={() => navigate('/application/new')} icon={Plus}>
                    New Application
                </Button>
            </div>

            {/* Filters */}
            <Card padding="sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="review">Review</option>
                    </select>
                </div>
            </Card>

            {/* Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Applicant</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Risk Score</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No applications found
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/application/${app.id}`)}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm text-gray-600">{app.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{app.name || 'N/A'}</p>
                                            <p className="text-sm text-gray-500">{app.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(app.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge status={app.status}>
                                                {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            {app.riskScore !== null && app.riskScore !== undefined ? (
                                                <span className={classNames(
                                                    'font-semibold',
                                                    app.riskScore <= 30 ? 'text-success-500' :
                                                        app.riskScore <= 50 ? 'text-warning-500' :
                                                            app.riskScore <= 70 ? 'text-orange-500' : 'text-danger-500'
                                                )}>
                                                    {app.riskScore}%
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/application/${app.id}`);
                                                }}
                                                className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Applications;
