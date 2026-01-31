import { useNavigate } from 'react-router-dom';
import { Card, Badge } from '../Common';
import { Eye } from 'lucide-react';
import { formatDate, getStatusColor, classNames } from '../../utils/helpers';

const RecentApplications = ({ applications = [] }) => {
    const navigate = useNavigate();

    if (applications.length === 0) {
        return (
            <Card>
                <Card.Header>
                    <Card.Title>Recent Applications</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="text-center py-8 text-gray-500">
                        No applications yet
                    </div>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Card padding="none">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {applications.map((app) => {
                            const statusColor = getStatusColor(app.status);
                            return (
                                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{app.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">{app.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(app.createdAt)}</td>
                                    <td className="px-6 py-4">
                                        <Badge status={app.status}>{app.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={classNames(
                                            'font-semibold',
                                            app.riskScore <= 30 ? 'text-success-500' :
                                                app.riskScore <= 50 ? 'text-warning-500' :
                                                    app.riskScore <= 70 ? 'text-orange-500' : 'text-danger-500'
                                        )}>
                                            {app.riskScore ?? '-'}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/application/${app.id}`)}
                                            className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default RecentApplications;
