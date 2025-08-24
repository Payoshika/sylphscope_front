import React from "react";
import Button from "../components/basicComponents/Button";

const LandingPage: React.FC = () => {
  return (
    <>
    {/* banner section */}
    <div className="max-w-[1400px] mx-auto flex flex-col justify-center items-center md:flex-row gap-8">
      <div className="flex-1 flex justify-center">
        <div className="flex flex-col items-center gap-4 p-12 max-w-[45rem]">
          <h2 className="text-center">Apply Student grant within 2 minutes </h2>
          <p className="mb-8 text-left">Figorous,  stands for Fast and Rigorous removes the manual application mandain by storing your past application record and automatically fills out application documents for you.</p>
          <Button 
            text="Signup to start" 
            variant="primary" 
            onClick={() => window.location.href = "/signup"}
          />
        </div>
      </div>
      <div className="flex-1 rounded shadow p-12">
        <div className="w-full flex flex-col gap-4 p-4">
          <h3 className="">Available Student Grants</h3>
          <div className="flex flex gap-4">
            {/* Grant Card 1 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-1 min-w-0">
              <h5 className="">Academic Excellence Scholarship</h5>
              <p className="text-sm text-gray-600 mb-2">For students with outstanding academic performance</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-semibold">$5,000</span>
                <span className="text-xs text-gray-500">Deadline: Dec 31, 2025</span>
              </div>
            </div>

            {/* Grant Card 2 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-1 min-w-0">
              <h5 className="">STEM Innovation Grant</h5>
              <p className="text-sm text-gray-600 mb-2">Supporting students in Science, Technology, Engineering & Math</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-semibold">$3,500</span>
                <span className="text-xs text-gray-500">Deadline: Jan 15, 2026</span>
              </div>
            </div>

            {/* Grant Card 3 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-1 min-w-0">
              <h5 className="">Community Service Award</h5>
              <p className="text-sm text-gray-600 mb-2">Recognizing students who give back to their communities</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-semibold">$2,000</span>
                <span className="text-xs text-gray-500">Deadline: Nov 30, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Features section */}
    <div className="mt-8 w-full py-16 px-8 rounded shadow flex justify-center">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center mb-12">
          <h3 className="">Why Choose Figorous?</h3>
          <p className="">
            Our platform streamlines the grant application process, making it faster and more efficient for students to access funding opportunities.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Feature Card 1 */}
          <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Find Scholarship</h4>
              <p className="text-gray-600">Find the scholarship of your choice by searching by keyword.</p>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Check your Eligibility</h4>
              <p className="text-gray-600">No more lengthly documentation, just answering questions will tell you your eligibility.</p>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Answer Automatically</h4>
              <p className="text-gray-600">FIgorous remembers your applications. when you apply other grants, it automatically fills for you</p>
            </div>
          </div>

          {/* Feature Card 4 */}
          <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Track Progress</h4>
              <p className="text-gray-600">Monitor your application status and receive real-time updates on your grant submissions.</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* Features for Grant Providers section */}
    <div className="w-full py-16 px-8 flex justify-center">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h3 className="">Features for Grant Providers</h3>
          <p className="">
            Powerful tools designed to streamline grant program creation and management for organizations and institutions.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Provider Feature 1 */}
          <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Pre-installed Questions & Groups</h4>
              <p className="text-gray-600">
                Access our comprehensive library of pre-built questions covering academic history and personal circumstances. Save time with our collaborative database.
              </p>
            </div>
          </div>

          {/* Provider Feature 2 */}
          <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Eligibility Criteria Builder</h4>
              <p className="text-gray-600">
                Create sophisticated eligibility requirements with our visual builder. Set conditions and combine criteria to ensure only qualified applicants apply.
              </p>
            </div>
          </div>

          {/* Provider Feature 3 */}
          <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Custom Question Builder</h4>
              <p className="text-gray-600">
                Create custom questions tailored to your grant requirements. Your questions join our shared library, helping build a comprehensive ecosystem.
              </p>
            </div>
          </div>

          {/* Provider Feature 4 */}
          <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Streamlined Publishing</h4>
              <p className="text-gray-600">
                Publish grant programs quickly with our intuitive interface. Set deadlines, define awards, and manage applications efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Contact section */}
    <div className="mt-8 w-full flex flex-col justify-center items-center sm:flex-row gap-8 py-16 px-8 rounded shadow">
      <div className="flex-1 flex justify-center">
        <div className="flex flex-col items-center gap-4 p-12 max-w-[45rem]">
          <h3 className="text-center">Ready to Get Started?</h3>
          <p className="text-center">
            Join thousands of students who have successfully secured funding through Figorous. 
            Start your scholarship journey today or get in touch with our team for personalized assistance.
          </p>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="flex gap-6 p-12 max-w-[30rem]">
          <Button 
            text="Sign Up" 
            variant="primary" 
            onClick={() => window.location.href = "/signup"}
          />
          <Button 
            text="Contact" 
            variant="outline" 
            onClick={() => window.location.href = "/contact"}
          />
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="w-full py-4 rounded shadow">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center">
          <p className="mb-0">© 2025 Figorous. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </>
  );
};

export default LandingPage;