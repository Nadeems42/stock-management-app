import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Smartphone,
    ShoppingCart,
    Wrench,
    Package,
    Users,
    LogOut
} from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
        { to: '/dashboard/pos', label: 'New Sale (POS)', icon: ShoppingCart },
        { to: '/dashboard/products', label: 'Inventory', icon: Smartphone },
        { to: '/dashboard/repairs', label: 'Repairs', icon: Wrench },
        { to: '/dashboard/sales', label: 'Sales History', icon: Package },
        { to: '/dashboard/customers', label: 'Customers', icon: Users },
        //    { to: '/dashboard/reports', label: 'Reports', icon: BarChart2 },
        //    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
    ];

    // Logic to highlight active link loosely (startWith) can be done with NavLink automatically

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-wider">MobileStore</h1>
                    <p className="text-xs text-slate-400 mt-1">{user?.name} ({user?.role})</p>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end={item.exact}
                                    className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                  `}
                                >
                                    <item.icon className="h-5 w-5 mr-3" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col">
                {/* Mobile Header (TODO) */}

                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
