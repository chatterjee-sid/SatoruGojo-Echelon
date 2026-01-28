import React from 'react';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-cyber-black text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <StatusBar />
                <main className="p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
