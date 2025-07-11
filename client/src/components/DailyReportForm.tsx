import React, { useState } from 'react';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { centers, reportCategories } from '../data/mockData';
import { ReportItem, DailyReport } from '../types';

interface DailyReportFormProps {
  onBack: () => void;
  selectedCenterId?: string;
}

export default function DailyReportForm({ onBack, selectedCenterId }: DailyReportFormProps) {
  const [selectedCenter, setSelectedCenter] = useState(selectedCenterId || centers[0].id);
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const [summary, setSummary] = useState({
    goingGood: '',
    goingWrong: '',
    highRisk: '',
    immediateAttention: '',
    progressFromLastDay: ''
  });

  const center = centers.find(c => c.id === selectedCenter);

  const handleStatusChange = (categoryIndex: number, subcategoryIndex: number, itemIndex: number, status: ReportItem['status']) => {
    const category = reportCategories[categoryIndex];
    const subcategory = category.subcategories[subcategoryIndex];
    const item = subcategory.items[itemIndex];
    
    const itemId = `${selectedCenter}-${categoryIndex}-${subcategoryIndex}-${itemIndex}`;
    
    setReportItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === itemId);
      const newItem: ReportItem = {
        id: itemId,
        category: category.name,
        subcategory: subcategory.name,
        item: item,
        status: status,
        remarks: '',
        responsiblePerson: getResponsiblePerson(category.name),
        timestamp: new Date(),
        centerId: selectedCenter
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], status };
        return updated;
      } else {
        return [...prev, newItem];
      }
    });
  };

  const handleRemarksChange = (itemId: string, remarks: string) => {
    setReportItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, remarks } : item
      )
    );
  };

  const getResponsiblePerson = (category: string): string => {
    const assignments: Record<string, string> = {
      'Hygiene & Cleanliness': 'Facility Team - Venkat Sai',
      'Infrastructure': 'Admin Team - Chandrakala',
      'Academics & Operations': 'Academic Team - Abhinav',
      'Campus Life': 'Campus Team - Shivika'
    };
    return assignments[category] || 'General Team';
  };

  const getItemStatus = (categoryIndex: number, subcategoryIndex: number, itemIndex: number): ReportItem['status'] => {
    const itemId = `${selectedCenter}-${categoryIndex}-${subcategoryIndex}-${itemIndex}`;
    const item = reportItems.find(i => i.id === itemId);
    return item?.status || 'OK';
  };

  const getItemRemarks = (categoryIndex: number, subcategoryIndex: number, itemIndex: number): string => {
    const itemId = `${selectedCenter}-${categoryIndex}-${subcategoryIndex}-${itemIndex}`;
    const item = reportItems.find(i => i.id === itemId);
    return item?.remarks || '';
  };

  const handleSubmit = () => {
    // Here you would typically submit to your backend
    console.log('Submitting report for center:', selectedCenter);
    console.log('Report items:', reportItems);
    console.log('Summary:', summary);
    
    alert('Daily report submitted successfully!');
    onBack();
  };

  const StatusButton = ({ 
    status, 
    currentStatus, 
    onClick, 
    icon: Icon, 
    label,
    color 
  }: {
    status: ReportItem['status'];
    currentStatus: ReportItem['status'];
    onClick: () => void;
    icon: React.ComponentType<any>;
    label: string;
    color: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition-colors
        ${currentStatus === status 
          ? `bg-${color}-100 text-${color}-800 border border-${color}-200` 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Daily Operations Report</h1>
          <p className="text-gray-600">Submit daily operational status for your center</p>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Submit Report</span>
        </button>
      </div>

      {/* Center Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-gray-900 mb-4">Select Center</h3>
        <select
          value={selectedCenter}
          onChange={(e) => setSelectedCenter(e.target.value)}
          className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {centers.map(center => (
            <option key={center.id} value={center.id}>
              {center.name} - {center.location}
            </option>
          ))}
        </select>
        {center && (
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">COO:</span>
              <span className="ml-2 font-medium">{center.coo}</span>
            </div>
            <div>
              <span className="text-gray-600">PM:</span>
              <span className="ml-2 font-medium">{center.pm}</span>
            </div>
          </div>
        )}
      </div>

      {/* Report Categories */}
      <div className="space-y-6">
        {reportCategories.map((category, categoryIndex) => (
          <div key={category.name} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            </div>
            <div className="p-6 space-y-6">
              {category.subcategories.map((subcategory, subcategoryIndex) => (
                <div key={subcategory.name}>
                  <h4 className="font-medium text-gray-800 mb-3">{subcategory.name}</h4>
                  <div className="space-y-3">
                    {subcategory.items.map((item, itemIndex) => {
                      const currentStatus = getItemStatus(categoryIndex, subcategoryIndex, itemIndex);
                      const currentRemarks = getItemRemarks(categoryIndex, subcategoryIndex, itemIndex);
                      const itemId = `${selectedCenter}-${categoryIndex}-${subcategoryIndex}-${itemIndex}`;

                      return (
                        <div key={item} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item}</p>
                            <div className="flex space-x-2 mt-2">
                              <StatusButton
                                status="OK"
                                currentStatus={currentStatus}
                                onClick={() => handleStatusChange(categoryIndex, subcategoryIndex, itemIndex, 'OK')}
                                icon={CheckCircle}
                                label="OK"
                                color="green"
                              />
                              <StatusButton
                                status="ISSUE"
                                currentStatus={currentStatus}
                                onClick={() => handleStatusChange(categoryIndex, subcategoryIndex, itemIndex, 'ISSUE')}
                                icon={AlertCircle}
                                label="Issue"
                                color="yellow"
                              />
                              <StatusButton
                                status="HIGH_RISK"
                                currentStatus={currentStatus}
                                onClick={() => handleStatusChange(categoryIndex, subcategoryIndex, itemIndex, 'HIGH_RISK')}
                                icon={AlertTriangle}
                                label="High Risk"
                                color="red"
                              />
                              <StatusButton
                                status="NA"
                                currentStatus={currentStatus}
                                onClick={() => handleStatusChange(categoryIndex, subcategoryIndex, itemIndex, 'NA')}
                                icon={Clock}
                                label="N/A"
                                color="gray"
                              />
                            </div>
                            {(currentStatus === 'ISSUE' || currentStatus === 'HIGH_RISK') && (
                              <textarea
                                placeholder="Enter remarks about this issue..."
                                value={currentRemarks}
                                onChange={(e) => handleRemarksChange(itemId, e.target.value)}
                                className="mt-2 w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={2}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's going good today?
            </label>
            <textarea
              value={summary.goingGood}
              onChange={(e) => setSummary(prev => ({ ...prev, goingGood: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="List positive highlights..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's going wrong?
            </label>
            <textarea
              value={summary.goingWrong}
              onChange={(e) => setSummary(prev => ({ ...prev, goingWrong: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="List issues and challenges..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's at high risk?
            </label>
            <textarea
              value={summary.highRisk}
              onChange={(e) => setSummary(prev => ({ ...prev, highRisk: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="List high-risk items..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What needs immediate attention?
            </label>
            <textarea
              value={summary.immediateAttention}
              onChange={(e) => setSummary(prev => ({ ...prev, immediateAttention: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="List urgent action items..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress from last day
            </label>
            <textarea
              value={summary.progressFromLastDay}
              onChange={(e) => setSummary(prev => ({ ...prev, progressFromLastDay: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe improvements and progress made..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}