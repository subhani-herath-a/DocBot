import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-400 px-6 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-black mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-900 max-w-3xl mx-auto">
            Have questions about our platform? We're here to help you get started 
            with better healthcare management.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              {
                icon: <MapPin className="h-6 w-6 text-blue-600" />,
                title: 'Address',
                content: (
                  <>
                    No:60,<br /> Galle Road,<br />
                    Colombo 02<br />
                    Sri Lanka.
                  </>
                ),
              },
              {
                icon: <Phone className="h-6 w-6 text-blue-600" />,
                title: 'Phone',
                content: (
                  <>
                    +94 11 123-4567<br />
                    Emergency: 1990
                  </>
                ),
              },
              {
                icon: <Mail className="h-6 w-6 text-blue-600" />,
                title: 'Email',
                content: (
                  <>
                    support@docbot.com<br />
                    info@docbot.com
                  </>
                ),
              },
              
            ].map((item, i) => (
              <div
                key={i}
                className="text-center bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6"
              >
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{item.content}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 shadow-xl rounded-lg p-8">
              <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
                Send us a Message
              </h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      className="mt-2 w-full border border-gray-300 dark:border-gray-700 p-3 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      className="mt-2 w-full border border-gray-300 dark:border-gray-700 p-3 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="someone@example.com"
                    className="mt-2 w-full border border-gray-300 dark:border-gray-700 p-3 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help you?"
                    className="mt-2 w-full border border-gray-300 dark:border-gray-700 p-3 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="mt-2 w-full border border-gray-300 dark:border-gray-700 p-3 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-900 hover:bg-blue-400 text-white font-semibold py-3 px-6 rounded text-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
