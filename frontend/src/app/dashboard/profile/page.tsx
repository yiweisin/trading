"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  // Mock user data
  const [userData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    jobTitle: "Investment Analyst",
    company: "Acme Capital",
    location: "New York, NY",
    joinDate: "2024-11-15T10:30:00Z",
    profileImage: null,
    subscription: "Premium",
    expiresAt: "2025-11-15T10:30:00Z",
    twoFactorEnabled: true,
    lastLogin: "2025-03-10T08:45:22Z",
    tradingExperience: "Intermediate",
    preferredMarkets: ["US Stocks", "ETFs", "Options"],
    bio: "Investment professional with 5+ years of experience in market analysis and portfolio management.",
  });

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Form state (would be populated from userData when edit begins)
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    jobTitle: userData.jobTitle,
    company: userData.company,
    location: userData.location,
    bio: userData.bio,
    tradingExperience: userData.tradingExperience,
    preferredMarkets: [...userData.preferredMarkets],
  });

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Would normally save changes to the backend here
      // For demo, we'll just log the form data
      console.log("Saving profile changes:", formData);
    }
    setIsEditing(!isEditing);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>

          <div className="mt-4 md:mt-0">
            <button
              onClick={toggleEditMode}
              className={`px-4 py-2 rounded-md font-medium ${
                isEditing
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>

            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="ml-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Profile image and subscription info */}
          <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
            <div className="flex flex-col items-center">
              <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 mb-4 text-3xl font-semibold">
                {userData.firstName.charAt(0)}
                {userData.lastName.charAt(0)}
              </div>

              {isEditing && (
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800 mb-4">
                  Upload Photo
                </button>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
                <h3 className="font-medium text-blue-800 mb-2">
                  Subscription Details
                </h3>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Plan:</span>{" "}
                  {userData.subscription}
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  <span className="font-medium">Renews:</span>{" "}
                  {formatDate(userData.expiresAt)}
                </p>
                <Link
                  href="/dashboard/settings"
                  className="text-sm text-blue-600 font-medium hover:text-blue-800"
                >
                  Manage Subscription
                </Link>
              </div>

              <div className="mt-6 w-full">
                <h3 className="font-medium text-gray-900 mb-2">
                  Account Security
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Two-Factor Authentication
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                      Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Login</span>
                    <span className="text-sm text-gray-600">
                      {new Date(userData.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/dashboard/settings"
                      className="text-sm text-blue-600 font-medium hover:text-blue-800"
                    >
                      Change Password
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile information */}
          <div className="md:w-2/3 md:border-l md:border-gray-200 md:pl-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="jobTitle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tradingExperience"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Trading Experience
                    </label>
                    <select
                      id="tradingExperience"
                      name="tradingExperience"
                      value={formData.tradingExperience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">
                      {userData.firstName} {userData.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{userData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {formatDate(userData.joinDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Job Title</p>
                    <p className="font-medium">{userData.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">{userData.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{userData.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trading Experience</p>
                    <p className="font-medium">{userData.tradingExperience}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="mt-1">{userData.bio}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Preferred Markets
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {userData.preferredMarkets.map((market, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {market}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Activity Summary</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Trades</p>
                  <p className="text-xl font-bold">157</p>
                  <p className="text-xs text-gray-500">Last 6 months</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Watchlists</p>
                  <p className="text-xl font-bold">4</p>
                  <p className="text-xs text-gray-500">Active watchlists</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Login Streak</p>
                  <p className="text-xl font-bold">12 days</p>
                  <p className="text-xs text-gray-500">Current streak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
