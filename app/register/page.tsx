'use client';

import { addPlayer, initializeDb } from '@/lib/localDb';
import ImageUploader from '@/components/ImageUploader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Men' as 'Men' | 'Women',
    photo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize DB on mount
  useEffect(() => {
    const init = async () => {
      await initializeDb();
      setIsLoading(false);
    };
    init();
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be at least 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await addPlayer({
        name: formData.name,
        phone: formData.phone,
        category: formData.category,
        photo: formData.photo,
        status: 'pending',
        payments: [],
      });

      setShowSuccess(true);
      setFormData({
        name: '',
        phone: '',
        category: 'Men',
        photo: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch {
      setErrors({ submit: 'Failed to register. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-tight py-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container-tight py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary-red mb-4">Register as a Player</h1>
        <p className="text-accent-gray-medium text-lg">
          Join the tournament and compete with other badminton players
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-8 p-4 bg-green-600/20 border border-green-600 text-green-400 rounded-lg text-center">
          <h3 className="font-bold mb-1">Registration Successful!</h3>
          <p className="text-sm">Your registration is pending approval. You will be redirected shortly.</p>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="mb-8 p-4 bg-red-600/20 border border-red-600 text-red-400 rounded-lg">
          <p>{errors.submit}</p>
        </div>
      )}

      {/* Registration Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              className={`input w-full ${errors.name ? 'border-red-600' : ''}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-2">
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              className={`input w-full ${errors.phone ? 'border-red-600' : ''}`}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+880 1700000000"
              disabled={isSubmitting}
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold mb-2">
              Category *
            </label>
            <select
              id="category"
              className="input w-full"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'Men' | 'Women' })}
              disabled={isSubmitting}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>

          {/* Photo Upload */}
          <div>
            <ImageUploader
              label="Player Photo (Optional)"
              onImageSelected={(base64) => setFormData({ ...formData, photo: base64 })}
              currentImage={formData.photo}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || showSuccess}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? 'Registering...' : 'Register as Player'}
            </button>
          </div>

          {/* Terms */}
          <p className="text-accent-gray-medium text-sm text-center">
            By registering, you agree to participate in the tournament and comply with the rules.
          </p>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="card text-center">
          <div className="text-4xl mb-3">✓</div>
          <h3 className="text-primary-red font-bold mb-2">Easy Registration</h3>
          <p className="text-accent-gray-medium text-sm">Register in seconds and start competing</p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-3">⏳</div>
          <h3 className="text-primary-red font-bold mb-2">Pending Approval</h3>
          <p className="text-accent-gray-medium text-sm">Admin will review and approve your registration</p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-primary-red font-bold mb-2">Compete Now</h3>
          <p className="text-accent-gray-medium text-sm">Join tournaments and track your progress</p>
        </div>
      </div>
    </div>
  );
}
