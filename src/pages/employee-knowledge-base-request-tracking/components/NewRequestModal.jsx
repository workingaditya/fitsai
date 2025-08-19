import React, { useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';

const NewRequestModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    urgency: 'normal'
  });
  const [attachments, setAttachments] = useState([]);

  const categories = [
    { id: 'software', name: 'Software & Applications', icon: '💻' },
    { id: 'hardware', name: 'Hardware & Equipment', icon: '🖥️' },
    { id: 'network', name: 'Network & Connectivity', icon: '🌐' },
    { id: 'account', name: 'Account & Access', icon: '🔐' },
    { id: 'email', name: 'Email & Communication', icon: '📧' },
    { id: 'phone', name: 'Phone & Mobile', icon: '📱' },
    { id: 'security', name: 'Security & Privacy', icon: '🔒' },
    { id: 'other', name: 'Other', icon: '❓' }
  ];

  const priorityLevels = [
    { 
      id: 'low', 
      name: 'Low', 
      description: 'No immediate impact on work',
      color: 'text-green-700 bg-green-100'
    },
    { 
      id: 'medium', 
      name: 'Medium', 
      description: 'Some impact on productivity',
      color: 'text-yellow-700 bg-yellow-100'
    },
    { 
      id: 'high', 
      name: 'High', 
      description: 'Significant impact on work',
      color: 'text-red-700 bg-red-100'
    }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!formData?.title?.trim() || !formData?.description?.trim() || !formData?.category) {
      return;
    }

    onSubmit({
      ...formData,
      attachments,
      priority: formData?.priority || 'medium'
    });
  };

  const handleAttachment = (e) => {
    const files = Array.from(e?.target?.files || []);
    setAttachments(prev => [...prev, ...files?.slice(0, 5 - prev?.length)]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev?.filter((_, i) => i !== index));
  };

  const isFormValid = formData?.title?.trim() && formData?.description?.trim() && formData?.category;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Submit IT Support Request</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Title *
            </label>
            <input
              type="text"
              value={formData?.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e?.target?.value }))}
              placeholder="Brief description of your issue"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories?.map(category => (
                <button
                  key={category?.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: category?.id }))}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    formData?.category === category?.id
                      ? 'border-blue-500 bg-blue-50' :'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-lg mb-1">{category?.icon}</div>
                  <div className="text-xs font-medium text-gray-900">{category?.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <div className="space-y-2">
              {priorityLevels?.map(level => (
                <label
                  key={level?.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData?.priority === level?.id
                      ? 'border-blue-500 bg-blue-50' :'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={level?.id}
                    checked={formData?.priority === level?.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e?.target?.value }))}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${level?.color}`}>
                        {level?.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{level?.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={formData?.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
              placeholder="Describe your issue in detail. Include what you were doing when the problem occurred and any error messages you saw."
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                onChange={handleAttachment}
                className="hidden"
                id="file-upload"
                disabled={attachments?.length >= 5}
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer ${attachments?.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Drop files here or click to upload
                </p>
                <p className="text-xs text-gray-500">
                  Screenshots, documents, or error logs (Max 5 files)
                </p>
              </label>
            </div>

            {/* Attachment List */}
            {attachments?.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments?.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700 truncate">{file?.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Tips for faster resolution:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Include specific error messages if any</li>
                  <li>Mention what you were trying to do</li>
                  <li>Add screenshots for visual issues</li>
                  <li>Note if this worked before</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequestModal;