import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import DriftWidget from "../../components/DriftWidget";

const Quotation = () => {
  const [formData, setFormData] = useState({
    email: "",
    purpose: "",
    deviceType: "",
    ageGroup: "",
    budgetRange: "",
    features: [],
    software: "",
    brandPreference: "",
    accessories: [],
    additionalInfo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedOptions = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOptions,
    }));
  };

  useEffect(() => {
    emailjs.init("x131CYqVRWoLrrh4q");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create template parameters object
      const templateParams = {
        from_email: formData.email,
        purpose: formData.purpose,
        device_type: formData.deviceType, // Changed from deviceType
        age_group: formData.ageGroup, // Changed from ageGroup
        budget_range: formData.budgetRange, // Changed from budgetRange
        features: formData.features.join(", "),
        software: formData.software,
        brand_preference: formData.brandPreference, // Changed from brandPreference
        accessories: formData.accessories.join(", "),
        additional_info: formData.additionalInfo, // Changed from additionalInfo
      };

      // Send email
      const response = await emailjs.send(
        "service_2tcwii5",
        "template_swzcb9l",
        templateParams
      );

      if (response.status === 200) {
        alert("Your quotation request has been sent successfully!");
        console.log(templateParams);
        // Reset form
        setFormData({
          email: "",
          purpose: "",
          deviceType: "",
          ageGroup: "",
          budgetRange: "",
          features: [],
          software: "",
          brandPreference: "",
          accessories: [],
          additionalInfo: "",
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert(`Failed to send email: ${error.message}`);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto px-6 py-8">
      <DriftWidget />

      {/* Added rounded corners and shadow to the form container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Quotation Service
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Address Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-lg font-medium">
              Your Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
          </div>

          {/* Purpose Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="purpose" className="text-lg font-medium">
              What is your primary purpose for the device?
            </label>
            <select
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            >
              <option value="">Select</option>
              <option value="personal">Personal use</option>
              <option value="professional">Professional work</option>
              <option value="gaming">Gaming</option>
              <option value="graphicDesign">Graphic Design/Video Editing</option>
              <option value="softwareDevelopment">Software Development</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Device Type Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="deviceType" className="text-lg font-medium">
              What is your preferred device type?
            </label>
            <select
              id="deviceType"
              name="deviceType"
              value={formData.deviceType}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            >
              <option value="">Select</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="notSure">Not sure yet</option>
            </select>
          </div>

          {/* Age Group Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="ageGroup" className="text-lg font-medium">
              What is your age group?
            </label>
            <select
              id="ageGroup"
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            >
              <option value="">Select</option>
              <option value="teen">Under 18</option>
              <option value="youngAdult">18-30</option>
              <option value="adult">31-50</option>
              <option value="senior">50+</option>
            </select>
          </div>

          {/* Budget Range Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="budgetRange" className="text-lg font-medium">
              What is your budget range?
            </label>
            <select
              id="budgetRange"
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            >
              <option value="">Select</option>
              <option value="under500">$500 or below</option>
              <option value="500to1000">$500 - $1000</option>
              <option value="1000to2000">$1000 - $2000</option>
              <option value="above2000">$2000 or above</option>
            </select>
          </div>

          
          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-gray-900 text-white py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 transition-colors duration-200"
            >
              Get Quote Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Quotation;