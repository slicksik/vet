import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getCoordinates } from '../../utils/geocoding';
import { Save, MapPin, Globe, Phone, Stethoscope, FileText, Image as ImageIcon, Upload, Loader, Building } from 'lucide-react';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '../../context/ToastContext';

const VetProfileSettings: React.FC = () => {
    const { user } = useAuth();
    const { vets, updateVetProfile } = useData();
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Get current vet data
    const currentVet = vets.find(v => v.id === user?.id);

    // Local state for form fields
    const [formData, setFormData] = useState({
        clinicName: '',
        address: '',
        city: '',
        zipCode: '',
        phone: '',
        website: '',
        description: '',
        image: '', // Keep image in local state for display
        services: '',
        specialty: '',
    });

    useEffect(() => {
        if (currentVet) {
            setFormData({
                clinicName: currentVet.clinicName || '',
                address: currentVet.address || '',
                city: currentVet.city || '',
                zipCode: currentVet.zipCode || '',
                phone: currentVet.phone || '',
                website: currentVet.website || '',
                description: currentVet.description || '',
                image: currentVet.image || '', // Populate image from currentVet
                services: currentVet.services?.join(', ') || '',
                specialty: currentVet.specialty || '',
            });
        }
    }, [currentVet]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);
        try {
            const storageRef = ref(storage, `profile-images/${user.id}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // Update vet profile with new image URL
            await updateVetProfile(user.id, { image: downloadURL });
            setFormData(prev => ({ ...prev, image: downloadURL })); // Update local state for immediate display
            showToast('Profile image updated!', 'success');
        } catch (error) {
            console.error("Error uploading image:", error);
            showToast('Failed to upload image. Please try again.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        try {
            let lat = currentVet?.latitude || 0;
            let lng = currentVet?.longitude || 0;

            // Attempt to geocode if address fields are present
            if (formData.address && formData.city && formData.zipCode) {
                const coords = await getCoordinates(formData.address, formData.city, formData.zipCode);
                if (coords) {
                    lat = coords.lat;
                    lng = coords.lng;
                    console.log('Geocoded coordinates:', { lat, lng });
                }
            }

            await updateVetProfile(user.id, {
                ...formData,
                latitude: lat,
                longitude: lng,
                services: formData.services.split(',').map(s => s.trim()).filter(s => s)
            });
            showToast('Profile updated successfully', 'success');
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!currentVet) return <div>Loading...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Update your clinic information and public profile</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Profile Image */}
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                            {formData.image ? (
                                <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-700 transition-colors shadow-sm">
                            <Upload className="w-4 h-4" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                            />
                        </label>
                    </div>
                </div>

                {/* Professional Details */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <Building className="w-5 h-5 mr-2 text-primary-600" />
                        Professional Details
                    </h4>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700">Clinic Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="clinicName"
                                    id="clinicName"
                                    value={formData.clinicName}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3"
                                    placeholder="Happy Paws Clinic"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Specialty</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Stethoscope className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="specialty"
                                    id="specialty"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3"
                                    placeholder="General, Surgery, etc."
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="services" className="block text-sm font-medium text-gray-700">Services</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Stethoscope className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="services"
                                    id="services"
                                    value={formData.services}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3"
                                    placeholder="Vaccination, Surgery, Dental Cleaning (comma separated)"
                                />
                                <p className="mt-2 text-xs text-gray-500">Separate multiple services with commas.</p>
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">About You</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                </div>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3"
                                    placeholder="Tell pet owners about your experience and philosophy..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                        Contact Information
                    </h4>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3"
                                    placeholder="123 Vet Street, City"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-xl py-3 pl-3"
                                    placeholder="New York"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP Code</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="zipCode"
                                    id="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-xl py-3 pl-3"
                                    placeholder="10001"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-1">
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Globe className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="website"
                                    id="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3"
                                    placeholder="https://yourclinic.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving || isUploading}
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                    >
                        {isSaving ? (
                            <>
                                <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save className="-ml-1 mr-2 h-5 w-5" />
                                Save Profile
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VetProfileSettings;
