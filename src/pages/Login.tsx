import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User as UserIcon, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'user' | 'vet' | 'admin'>('user');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, role);
        if (role === 'vet') {
            navigate('/dashboard');
        } else if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center">
                        <Stethoscope className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to Vetify
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            onClick={() => setRole('user')}
                            className={`flex items-center px-4 py-2 rounded-md ${role === 'user'
                                    ? 'bg-primary-100 text-primary-700 border-primary-200 border'
                                    : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                                }`}
                        >
                            <UserIcon className="w-4 h-4 mr-2" />
                            Pet Owner
                        </button>
                        <button
                            onClick={() => setRole('vet')}
                            className={`flex items-center px-4 py-2 rounded-md ${role === 'vet'
                                    ? 'bg-primary-100 text-primary-700 border-primary-200 border'
                                    : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                                }`}
                        >
                            <Stethoscope className="w-4 h-4 mr-2" />
                            Veterinarian
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex items-center px-4 py-2 rounded-md ${role === 'admin'
                                    ? 'bg-primary-100 text-primary-700 border-primary-200 border'
                                    : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                                }`}
                        >
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Admin
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder={role === 'vet' ? 'sarah@pawsome.com' : role === 'admin' ? 'admin@vetify.com' : 'you@example.com'}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Demo Accounts
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            <button
                                onClick={() => {
                                    setEmail('sarah@pawsome.com');
                                    setRole('vet');
                                }}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                Use Demo Vet Account
                            </button>
                            <button
                                onClick={() => {
                                    setEmail('admin@vetify.com');
                                    setRole('admin');
                                }}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                Use Demo Admin Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
