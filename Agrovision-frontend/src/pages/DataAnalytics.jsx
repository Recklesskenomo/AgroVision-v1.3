import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DataAnalystOnly } from '../components/RoleBasedAccess';

const DataAnalytics = () => {
    const { hasRole, ROLES } = useAuth();
    const navigate = useNavigate();

    // Redirect non-data analyst users
    React.useEffect(() => {
        if (!hasRole(ROLES.DATA_ANALYST)) {
            navigate('/dashboard');
        }
    }, [hasRole, navigate, ROLES.DATA_ANALYST]);

    // Mock data for charts and reports
    const yearlyYield = [
        { year: '2018', yield: 5200 },
        { year: '2019', yield: 5800 },
        { year: '2020', yield: 5300 },
        { year: '2021', yield: 6100 },
        { year: '2022', yield: 6700 },
    ];

    const cropDistribution = [
        { crop: 'Corn', acres: 120, percentage: 40 },
        { crop: 'Soybeans', acres: 90, percentage: 30 },
        { crop: 'Wheat', acres: 45, percentage: 15 },
        { crop: 'Alfalfa', acres: 30, percentage: 10 },
        { crop: 'Other', acres: 15, percentage: 5 },
    ];

    const livestockHealth = [
        { category: 'Healthy', count: 245, percentage: 82 },
        { category: 'Under Observation', count: 42, percentage: 14 },
        { category: 'Treatment Required', count: 12, percentage: 4 },
    ];

    return (
        <DataAnalystOnly fallback={<div className="p-4">You don't have permission to access this page.</div>}>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Farm Data Analytics</h1>
                
                {/* Analytics Dashboard Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-green-600">6,700 lbs/acre</h3>
                        <p className="text-gray-600">Average Yield (2022)</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-600">300 acres</h3>
                        <p className="text-gray-600">Total Cultivated Area</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-purple-600">299 animals</h3>
                        <p className="text-gray-600">Total Livestock</p>
                    </div>
                </div>
                
                {/* Yearly Yield Analysis */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">Yearly Yield Analysis</h2>
                    <div className="h-64 w-full bg-gray-100 p-4 rounded flex items-end justify-around relative">
                        {/* Simplified chart visualization */}
                        {yearlyYield.map((data, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div 
                                    className="bg-green-500 w-16" 
                                    style={{ 
                                        height: `${(data.yield / 7000) * 100}%`,
                                        transition: 'height 0.5s ease'
                                    }}
                                ></div>
                                <div className="text-xs mt-2">{data.year}</div>
                                <div className="absolute bottom-20 text-xs font-medium">
                                    {data.yield}
                                </div>
                            </div>
                        ))}
                        <div className="absolute inset-y-0 left-0 flex items-center -ml-4">
                            <div className="text-xs transform -rotate-90">Yield (lbs/acre)</div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm">
                            Export Data
                        </button>
                        <div className="space-x-2">
                            <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm">
                                Last 5 Years
                            </button>
                            <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm">
                                Last 10 Years
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Crop Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Crop Distribution</h2>
                        <div className="mb-4 h-48 w-48 mx-auto relative rounded-full overflow-hidden">
                            {/* Simplified pie chart */}
                            <div className="absolute inset-0" style={{ 
                                background: 'conic-gradient(#4ade80 0% 40%, #60a5fa 40% 70%, #fbbf24 70% 85%, #f87171 85% 95%, #c084fc 95% 100%)' 
                            }}></div>
                        </div>
                        <div className="space-y-2">
                            {cropDistribution.map((crop, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center">
                                        <span className={`inline-block w-3 h-3 mr-2 rounded-full 
                                            ${index === 0 ? 'bg-green-400' : 
                                            index === 1 ? 'bg-blue-400' : 
                                            index === 2 ? 'bg-yellow-400' : 
                                            index === 3 ? 'bg-red-400' : 'bg-purple-400'}`}>
                                        </span>
                                        <span>{crop.crop}</span>
                                    </div>
                                    <div>{crop.acres} acres ({crop.percentage}%)</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Livestock Health */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Livestock Health Status</h2>
                        <div className="space-y-4">
                            {livestockHealth.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{item.category}</span>
                                        <span>{item.count} animals ({item.percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className={`h-2.5 rounded-full ${
                                                index === 0 ? 'bg-green-500' : 
                                                index === 1 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-2">Health Trend</h3>
                            <div className="h-32 w-full bg-gray-100 p-2 rounded">
                                {/* Simplified line chart */}
                                <svg className="h-full w-full" viewBox="0 0 100 50">
                                    <path 
                                        d="M0,40 L10,35 L20,30 L30,32 L40,25 L50,28 L60,15 L70,18 L80,10 L90,12 L100,5" 
                                        fill="none" 
                                        stroke="#10b981" 
                                        strokeWidth="2" 
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Report Generation */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Generate Reports</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer transition">
                            <h3 className="font-medium mb-2">Yield Analysis Report</h3>
                            <p className="text-gray-600 text-sm mb-4">Comprehensive analysis of crop yields with comparisons to previous years.</p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
                                Generate
                            </button>
                        </div>
                        <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer transition">
                            <h3 className="font-medium mb-2">Livestock Health Report</h3>
                            <p className="text-gray-600 text-sm mb-4">Detailed health statistics and veterinary recommendations.</p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
                                Generate
                            </button>
                        </div>
                        <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer transition">
                            <h3 className="font-medium mb-2">Resource Utilization Report</h3>
                            <p className="text-gray-600 text-sm mb-4">Analysis of water, feed, and other resources usage efficiency.</p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
                                Generate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DataAnalystOnly>
    );
};

export default DataAnalytics; 