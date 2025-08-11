import React from 'react';
import { CheckCircle } from 'lucide-react';

const About = () => {
  const benefits = [
    "HIPAA-compliant security and privacy",
    "Integration with major insurance providers",
    "Mobile-responsive design",
    "Real-time appointment updates",
    "Comprehensive reporting tools"
  ];

  return (
    <section id="about" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-400 px-6 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-black mb-6">
              About DocBot
            </h2>
            <p className="text-lg text-gray-600 dark:text-black-300 mb-8 leading-relaxed">
              DocBot is a comprehensive healthcare management platform that connects patients 
              with healthcare providers through innovative technology. Our mission is to make 
              healthcare more accessible, efficient, and patient-centered.
            </p>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-800 dark:text-black-400">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Platform Uptime</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-blue-400 mb-2">4.9/5</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">User Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    To revolutionize healthcare delivery by providing seamless digital solutions 
                    that empower patients, support healthcare providers, and improve health outcomes 
                    for communities worldwide.
                  </p>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Core Values</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Patient-first approach</li>
                    <li>• Data privacy and security</li>
                    <li>• Innovation in healthcare</li>
                    <li>• Accessibility for all</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
