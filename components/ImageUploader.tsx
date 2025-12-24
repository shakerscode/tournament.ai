'use client';

import { ChangeEvent, useRef, useState } from 'react';

export interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  label?: string;
  currentImage?: string;
}

export default function ImageUploader({
  onImageSelected,
  label = 'Upload Player Photo',
  currentImage,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setPreview(base64String);
        onImageSelected(base64String);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError('Failed to read file');
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(undefined);
    onImageSelected('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-accent-white mb-3">{label}</label>

      <div
        className="border-2 border-dashed border-secondary-black-lighter rounded-lg p-6 text-center cursor-pointer hover:border-primary-red transition-colors"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
          aria-label="Upload image"
        />

        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-[-8px] right-[-8px] bg-primary-red text-accent-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-primary-red-dark"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ) : (
          <div>
            <svg className="w-12 h-12 mx-auto mb-2 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-accent-white font-semibold">
              {isLoading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-accent-gray-medium text-sm mt-1">PNG, JPG, GIF up to 2MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
