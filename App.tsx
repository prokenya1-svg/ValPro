import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { jobService } from './services/jobService';
import { api } from './services/api';
import { Job, User, Certification } from './types';
import Dashboard from './components/Dashboard';
import JobsList from './components/JobsList';
import JobDetail from './components/JobDetail';
import CreateJobForm from './components/CreateJobForm';
import Profile from './components/Profile';
import ChatBot from './components/ChatBot';
import ValuerFieldAssistant from './components/ValuerFieldAssistant';
import LoginScreen from './components/LoginScreen';
import ValuerPerformance from './components/ValuerPerformance';
import Homepage from './components/Homepage';
import About from './components/About';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import { ICONS } from './constants';

type View = 'home' | 'dashboard' | 'jobs' | 'job-detail' | 'profile' | 'valuer-performance' | 'about' | 'pricing' | 'faq' | 'contact' | 'admin-panel' | 'login';

interface IDataContext {
    jobs: Job[];
    users: User[];
    currentUser: User | null; // Can be null now
    isLoading: boolean;
    refetchData: () => Promise<void>;
    // --- State Mutation Actions ---
    updateJob: (updatedJob: Job) => Promise<void>;
    updateUser: (updatedUser: User) => Promise<void>;
    createJob: (newJob: Job) => Promise<void>;
    updateCertificationStatus: (userId: string, certName: string, status: Certification['status']) => Promise<void>;
}

const DataContext = createContext<IDataContext | null>(null);
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within a DataProvider");
    return context;
};

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<View>('home');
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    
    const [isCreateJobFormOpen, setIsCreateJobFormOpen] = useState(false);
    const [isFieldAssistantOpen, setIsFieldAssistantOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const [jobs, setJobs] = useState<Job[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [fetchedJobs, fetchedUsers] = await Promise.all([
                api.jobs.getAll(),
                api.users.getAll()
            ]);
            setJobs(fetchedJobs);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchData();
            jobService.registerServerPushCallback(fetchData);
        } else {
            // No user, clear data
            setJobs([]);
            setUsers([]);
            setIsLoading(false);
        }
    }, [currentUser, fetchData]);
    
    // --- Context Actions ---
    const updateJob = async (updatedJob: Job) => {
        setJobs(prevJobs => prevJobs.map(j => j.id === updatedJob.id ? updatedJob : j)); // Optimistic update
        try {
            await api.jobs.update(updatedJob);
            await fetchData(); // Resync with "server"
        } catch (error) {
            console.error("Failed to update job, reverting.", error);
            await fetchData(); // Revert by fetching original data
        }
    };

    const updateUser = async (updatedUser: User) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        if (currentUser && updatedUser.id === currentUser.id) {
            setCurrentUser(updatedUser);
        }
        try {
            await api.users.update(updatedUser);
            await fetchData();
        } catch (error) {
            console.error("Failed to update user, reverting.", error);
            await fetchData();
        }
    };

    const createJob = async (newJob: Job) => {
        setIsCreateJobFormOpen(false);
        setIsLoading(true);
        try {
            await api.jobs.create(newJob);
            await fetchData();
            setView('jobs');
        } catch (error) {
            console.error("Failed to create job", error);
            await fetchData(); // Ensure UI is consistent
        }
    };
    
    const updateCertificationStatus = async (userId: string, certName: string, status: Certification['status']) => {
        try {
            await api.users.updateCertificationStatus(userId, certName, status);
            await fetchData();
        } catch (error) {
            console.error("Failed to update cert status", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        setView('dashboard');
    };
    
    const handleLogout = async () => {
        await api.auth.logout();
        setCurrentUser(null);
        setView('home');
    };

    const handleViewJob = (jobId: string) => {
        setSelectedJobId(jobId);
        setView('job-detail');
    };
    
    const handleBackToJobs = () => {
        setSelectedJobId(null);
        setView('jobs');
    };
    
    const handleNavigate = (targetView: View) => {
        const privateViews: View[] = ['dashboard', 'jobs', 'job-detail', 'profile', 'valuer-performance', 'admin-panel'];
        if (!currentUser && privateViews.includes(targetView)) {
            setView('login');
        } else {
            setView(targetView);
        }
        window.scrollTo(0, 0); // Scroll to top on navigation
        setIsMobileMenuOpen(false);
    };
    
    useEffect(() => {
      if (!Capacitor.isNativePlatform()) return;

      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') PushNotifications.register();
      });
      PushNotifications.addListener('registration', (token: Token) => {
        if(currentUser) api.notifications.registerPushToken(token.value);
      });
      LocalNotifications.requestPermissions();
      LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
          const jobId = action.notification.extra?.jobId;
          if (jobId) handleViewJob(jobId);
      });
    }, [currentUser]);

    const selectedJob = currentUser ? jobs.find(job => job.id === selectedJobId) : null;
    
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const setNativeUI = async () => {
            if (Capacitor.isNativePlatform()) {
                await StatusBar.setStyle({ style: isDarkMode ? Style.Light : Style.Dark });
            }
        };
        if (isDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        setNativeUI();
    }, [isDarkMode]);

    const renderView = () => {
        if (view === 'login') return <LoginScreen onLogin={handleLogin} />;
        
        const publicViews: { [key in View]?: React.ReactNode } = {
            'home': <Homepage onNavigate={handleNavigate} />,
            'about': <About />,
            'pricing': <Pricing onNavigate={handleNavigate} />,
            'faq': <FAQ />,
            'contact': <Contact />,
        };
        if (publicViews[view]) return publicViews[view];
        
        if (!currentUser) return <Homepage onNavigate={handleNavigate} />; // Fallback for logged-out users

        if (isLoading && view !== 'job-detail') {
             return <div className="flex justify-center items-center p-20">{ICONS.spinner} Loading...</div>;
        }

        switch (view) {
            case 'admin-panel': return <AdminPanel onNavigate={handleNavigate} />;
            case 'dashboard':
                return <Dashboard 
                           onViewJob={handleViewJob} 
                           onStartFieldAssistant={() => setIsFieldAssistantOpen(true)} 
                           onViewPerformance={() => handleNavigate('valuer-performance')} 
                           onViewJobsList={() => handleNavigate('jobs')} 
                           onNavigate={handleNavigate}
                       />;
            case 'jobs':
                return <JobsList onViewJob={handleViewJob} onCreateJob={() => setIsCreateJobFormOpen(true)} />;
            case 'job-detail':
                return selectedJob ? <JobDetail key={selectedJobId} job={selectedJob} onBack={handleBackToJobs} /> : <p>Job not found or still loading...</p>;
            case 'profile':
                return <Profile onNavigate={handleNavigate} />;
            case 'valuer-performance':
                return <ValuerPerformance onBack={() => handleNavigate('dashboard')} />;
            default:
                return <Homepage onNavigate={handleNavigate} />;
        }
    };

    const NavButton: React.FC<{ currentView: View, targetView: View, label: string }> = ({ currentView, targetView, label }) => (
        <button onClick={() => handleNavigate(targetView)} className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === targetView ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{label}</button>
    );

     const MobileNavButton: React.FC<{ label: string, targetView: View }> = ({ label, targetView }) => (
        <button onClick={() => handleNavigate(targetView)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">{label}</button>
    );

    const renderNavBar = () => {
        if (view === 'login') return null; // No navbar on login screen

        return (
            <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                           <div className="font-bold text-xl text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => handleNavigate('home')}>ValPro AI</div>
                           <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {currentUser ? (
                                        <>
                                            <NavButton currentView={view} targetView="dashboard" label="Dashboard" />
                                            <NavButton currentView={view} targetView="jobs" label="Jobs" />
                                        </>
                                    ) : (
                                        <>
                                            <NavButton currentView={view} targetView="about" label="About Us" />
                                            <NavButton currentView={view} targetView="pricing" label="Pricing" />
                                            <NavButton currentView={view} targetView="faq" label="FAQ" />
                                        </>
                                    )}
                                </div>
                           </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                {isDarkMode ? '☀️' : '🌙'}
                            </button>
                            {currentUser ? (
                                <>
                                    <button onClick={() => handleNavigate('profile')} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <img className="h-8 w-8 rounded-full" src={currentUser.avatarUrl} alt="" />
                                        <span className="text-sm font-medium">{currentUser.name}</span>
                                    </button>
                                    <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700">Logout</button>
                                </>
                            ) : (
                                <button onClick={() => handleNavigate('login')} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                                    Login / Sign Up
                                </button>
                            )}
                        </div>
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                {isDarkMode ? '☀️' : '🌙'}
                            </button>
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!isMobileMenuOpen ? 'block' : 'hidden'} d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={isMobileMenuOpen ? 'block' : 'hidden'} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                             {currentUser ? (
                                <>
                                    <MobileNavButton label="Dashboard" targetView="dashboard" />
                                    <MobileNavButton label="Jobs" targetView="jobs" />
                                    <MobileNavButton label="Profile" targetView="profile" />
                                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Logout</button>
                                </>
                             ) : (
                                <>
                                    <MobileNavButton label="Home" targetView="home" />
                                    <MobileNavButton label="About Us" targetView="about" />
                                    <MobileNavButton label="Pricing" targetView="pricing" />
                                    <MobileNavButton label="FAQ" targetView="faq" />
                                    <MobileNavButton label="Login / Sign Up" targetView="login" />
                                </>
                             )}
                        </div>
                    </div>
                )}
            </nav>
        );
    }


    return (
        <DataContext.Provider value={{ jobs, users, currentUser, isLoading, refetchData: fetchData, updateJob, updateUser, createJob, updateCertificationStatus }}>
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 font-sans">
                {renderNavBar()}
                <main>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        {renderView()}
                    </div>
                </main>
                {currentUser && isCreateJobFormOpen && <CreateJobForm onClose={() => setIsCreateJobFormOpen(false)} onJobCreated={createJob} />}
                {currentUser && isFieldAssistantOpen && <ValuerFieldAssistant onClose={() => setIsFieldAssistantOpen(false)} />}
                {currentUser && <ChatBot />}
            </div>
        </DataContext.Provider>
    );
};

export default App;