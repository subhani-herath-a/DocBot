import React from 'react';
import {
  Calendar,
  MessageSquare,
  User,
  Clock,
  Bell,
  Settings,
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Appointment Booking',
      description:
        'Schedule appointments with your preferred doctors in just a few clicks. Choose your time, date, and specialist.',
    },
    {
      icon: MessageSquare,
      title: '24/7 AI Health Assistant',
      description:
        'Get instant answers to health questions, symptom guidance, and medical advice from our AI-powered chatbot.',
    },
    {
      icon: User,
      title: 'Complete Medical Records',
      description:
        'Access your complete medical history, prescriptions, and test results securely in one place.',
    },
    {
      icon: Clock,
      title: 'Real-time Scheduling',
      description:
        'See real-time doctor availability and get instant confirmation for your appointments.',
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description:
        'Never miss an appointment with automated reminders via email, SMS, and in-app notifications.',
    },
    {
      icon: Settings,
      title: 'Personalized Dashboard',
      description:
        'Manage your health with a personalized dashboard tailored to patients, doctors, and administrators.',
    },
  ];

  return (
    <section id="features" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-400 px-6 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-black mb-4">
            Why Choose DocBot?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-900 max-w-3xl mx-auto">
            Experience modern healthcare with our comprehensive platform designed for patients,
            doctors, and healthcare administrators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border-0 rounded-lg shadow-lg hover:shadow-xl bg-white dark:bg-gray-900 transition-shadow duration-300 hover:-translate-y-1"
            >
              <div className="text-center p-6">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
