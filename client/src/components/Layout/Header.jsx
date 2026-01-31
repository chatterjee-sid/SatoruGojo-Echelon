import { Bell, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

const Header = ({ title }) => {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100">
            <div className="flex items-center justify-between px-6 py-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.email || 'user@example.com'}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-medium text-primary-600">
                                    {getInitials(user?.name)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
