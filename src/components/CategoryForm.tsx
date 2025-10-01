'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';

interface CategoryFormProps {
    category?: Category | null;
    onSuccess?: () => void;
    onCancel?: () => void;
    mode?: 'create' | 'edit';
}

const PRESET_COLORS = [
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#ec4899',
    '#f43f5e',
    '#6b7280',
    '#374151',
    '#1f2937',
];

const PRESET_ICONS = [
    '🍽️',
    '🚗',
    '🛍️',
    '🎬',
    '📄',
    '🏥',
    '📚',
    '✈️',
    '💰',
    '📦',
    '🏠',
    '⚡',
    '📱',
    '🎮',
    '👕',
    '💊',
    '🚌',
    '☕',
    '🎵',
    '🏋️',
    '🐕',
    '🌱',
    '🎁',
    '🔧',
    '📊',
    '💳',
    '🍕',
    '⛽',
    '🎯',
    '📝',
];

export default function CategoryForm({ category, onSuccess, onCancel, mode = 'edit' }: CategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#6b7280',
        icon: '📦',
        budget: '',
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
                color: category.color || '#6b7280',
                icon: category.icon || '📦',
                budget: category.budget ? category.budget.toString() : '',
            });
        }
    }, [category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Please enter a category name');
            return;
        }

        setLoading(true);

        try {
            const url = mode === 'create' ? '/api/categories' : `/api/categories/${category?.id}`;
            const method = mode === 'create' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    description: formData.description.trim() || null,
                    color: formData.color,
                    icon: formData.icon,
                    budget: formData.budget ? parseFloat(formData.budget) : null,
                }),
            });

            const data = await response.json();

            if (data.success) {
                if (onSuccess) {
                    onSuccess();
                }

                alert(`Category ${mode === 'create' ? 'created' : 'updated'} successfully!`);

                if (mode === 'create') {
                    // Reset form for creating new categories
                    setFormData({
                        name: '',
                        description: '',
                        color: '#6b7280',
                        icon: '📦',
                        budget: '',
                    });
                }
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} category:`, error);
            alert(`Failed to ${mode === 'create' ? 'create' : 'update'} category`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
                {mode === 'create' ? 'Create New Category' : `Edit Category: ${category?.name}`}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                        Category Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Food & Dining, Transportation"
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md 
                                   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500`}
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Brief description of this category (optional)"
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md 
                                   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500`}
                    />
                </div>

                {/* Monthly Budget */}
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-1">
                        Monthly Budget
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-500">$</span>
                        <input
                            type="number"
                            id="budget"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className={`w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md 
                                       focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500`}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Set your monthly spending limit for this category</p>
                </div>

                {/* Icon Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
                    <div className="grid grid-cols-10 gap-2 p-3 border border-slate-300 rounded-md max-h-32 overflow-y-auto">
                        {PRESET_ICONS.map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                                className={`text-2xl p-2 rounded hover:bg-slate-100 transition-colors ${
                                    formData.icon === icon ? 'bg-slate-200 ring-2 ring-slate-400' : ''
                                }`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Selected: {formData.icon}</p>
                </div>

                {/* Color Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                    <div className="grid grid-cols-10 gap-2 p-3 border border-slate-300 rounded-md">
                        {PRESET_COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, color }))}
                                className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                                    formData.color === color ? 'border-slate-800' : 'border-slate-300'
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm text-slate-600">Preview:</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-xl">{formData.icon}</span>
                            <span
                                className="px-3 py-1 rounded-full text-white text-sm font-medium"
                                style={{ backgroundColor: formData.color }}
                            >
                                {formData.name || 'Category Name'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 
                                   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 
                                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                    >
                        {loading
                            ? mode === 'create'
                                ? 'Creating...'
                                : 'Updating...'
                            : mode === 'create'
                              ? 'Create Category'
                              : 'Update Category'}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className={`px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 
                                       focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors`}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
