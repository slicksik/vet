import React from 'react';
import { Star, Quote } from 'lucide-react';

const MOCK_TESTIMONIALS = [
    {
        id: 1,
        content: "Dr. Wilson was amazing with my nervous cat. She took the time to make him feel comfortable before the exam. Highly recommended!",
        author: "Sarah Jenkins",
        role: "Cat Mom",
        rating: 5,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        id: 2,
        content: "The best veterinary experience we've ever had. The clinic is beautiful and the staff is incredibly professional. Booking was a breeze!",
        author: "Michael Thompson",
        role: "Dog Dad",
        rating: 5,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        id: 3,
        content: "I love how easy it is to find available appointments. Dr. Chen explained everything clearly and put my mind at ease.",
        author: "Emily Davis",
        role: "Rabbit Owner",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
    }
];

const Testimonials: React.FC = () => {
    return (
        <div className="bg-primary-50 py-24 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-200 blur-3xl"></div>
                <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-indigo-200 blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base text-primary-600 font-bold tracking-wide uppercase bg-white inline-block px-3 py-1 rounded-full shadow-sm mb-4">
                        Testimonials
                    </h2>
                    <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Trusted by pet parents everywhere
                    </h3>
                    <p className="mt-4 text-xl text-gray-500">
                        Don't just take our word for it. Here's what our community has to say about their experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MOCK_TESTIMONIALS.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col"
                        >
                            <div className="mb-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <Quote className="w-8 h-8 text-primary-100 mb-2" />
                                <p className="text-gray-600 italic text-lg leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                            </div>

                            <div className="mt-auto flex items-center pt-6 border-t border-gray-50">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.author}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100"
                                />
                                <div className="ml-4">
                                    <h4 className="text-sm font-bold text-gray-900">{testimonial.author}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
