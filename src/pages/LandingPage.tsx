import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BarChart3, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">CalendarCRM</span>
          </div>
          <Link
            to="/dashboard"
            className="rounded-full bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors"
          >
            Enter Platform
          </Link>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="mb-8 text-5xl font-bold text-gray-900">
          Visualize Your Leads Like Never Before
        </h1>
        <p className="mb-12 text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your lead management with our innovative calendar-based CRM. 
          See your opportunities unfold in a familiar, time-based view.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition-colors"
        >
          <span>Get Started</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center p-6">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Calendar View</h3>
            <p className="text-gray-600">
              View and manage leads in an intuitive calendar interface
            </p>
          </div>
          <div className="text-center p-6">
            <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Analytics</h3>
            <p className="text-gray-600">
              Get powerful insights into your sales pipeline
            </p>
          </div>
          <div className="text-center p-6">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Team Collaboration</h3>
            <p className="text-gray-600">
              Work seamlessly with your team and track progress
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">CalendarCRM</span>
            </div>
            <p className="text-gray-600">© 2024 CalendarCRM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}