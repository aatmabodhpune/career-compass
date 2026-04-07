import { Container } from './Container';

interface NavbarProps {
    activeTab: string;
    onTabChange?: (tab: string) => void;
    userName?: string;
    avatarUrl?: string;
}

const navTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile', label: 'Profile' },
    { id: 'resources', label: 'Resources' },
];

export function Navbar({ 
    activeTab, 
    onTabChange, 
    userName = 'User', 
    avatarUrl 
}: NavbarProps) {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <Container className="h-16 flex items-center justify-between">
                {/* Left: Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-indigo-500/20 shadow-lg">
                        <span className="text-white font-black text-xl italic">C</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-gray-900 hidden sm:block">
                        CareerCompass
                    </span>
                </div>

                {/* Center: Tabs */}
                <nav className="flex items-center space-x-1 sm:space-x-4">
                    {navTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange?.(tab.id)}
                            className={`
                                px-4 py-2 text-sm font-bold rounded-full transition-all duration-200
                                ${activeTab === tab.id 
                                    ? 'bg-teal-50 text-teal-700 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Right: User Section */}
                <div className="flex items-center gap-3 sm:gap-6">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>
                    
                    <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-100">
                        <div className="hidden lg:block text-right">
                            <p className="text-sm font-bold text-gray-900 leading-none">{userName}</p>
                            <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest text-[10px]">Student</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-teal-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-teal-500/5">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-teal-700 font-bold text-sm">
                                    {userName.charAt(0)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </header>
    );
}
