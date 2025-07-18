'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { IProject } from '@/models/Project';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    project: IProject;
}

export default function DeleteModal({ isOpen, onClose, onSuccess, project }: DeleteModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/projects/${project._id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                onSuccess();
            } else {
                setError(data.error || 'Failed to delete project');
            }
        } catch (err) {
            setError('Network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Delete Project</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                Are you sure?
                            </h3>
                            <p className="text-sm text-gray-500">
                                This action cannot be undone. This will permanently delete the project:
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                            {project.name}
                        </div>
                        <div className="text-sm text-gray-500">
                            {project.description}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Deleting...' : 'Delete Project'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}