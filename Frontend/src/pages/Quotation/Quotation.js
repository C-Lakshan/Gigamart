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

  const [errors, setErrors] = useState({
    email: "",
    software: "",
    brandPreference: "",
    additionalInfo: "",
  });

  const validateEmail = (email) => {
    // Ensure mail format
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validateSoftware = (software) => {
    return software.trim().length > 0;
  };

  const validateBrandPreference = (brand) => {
    // Ensure no special characters except spaces, commas, hyphens
    const regex = /^[a-zA-Z0-9\s,\-]*$/;
    return regex.test(brand);
  };

  const validateAdditionalInfo = (info) => {
    // Limit length to 300 characters
    return info.length <= 300;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Validate different fields
    switch (name) {
      case "email":
        if (value.trim() !== "" && !validateEmail(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Please enter a valid email address",
          }));
        }
        break;

      case "software":
        if (!validateSoftware(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            software: "Please specify what software you plan to use",
          }));
        }
        break;

      case "brandPreference":
        if (value.trim() !== "" && !validateBrandPreference(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            brandPreference:
              "Please use only letters, numbers, spaces, commas, and hyphens",
          }));
        }
        break;

      case "additionalInfo":
        if (!validateAdditionalInfo(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            additionalInfo:
              "Please limit additional information to 300 characters",
          }));
        }
        break;

      default:
        break;
    }
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

    let formIsValid = true;
    const newErrors = { ...errors };

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      formIsValid = false;
    }

    if (!validateSoftware(formData.software)) {
      newErrors.software = "Please specify what software you plan to use";
      formIsValid = false;
    }

    if (
      formData.brandPreference.trim() !== "" &&
      !validateBrandPreference(formData.brandPreference)
    ) {
      newErrors.brandPreference =
        "Please use only letters, numbers, spaces, commas, and hyphens";
      formIsValid = false;
    }

    if (!validateAdditionalInfo(formData.additionalInfo)) {
      newErrors.additionalInfo =
        "Please limit additional information to 300 characters";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (!formIsValid) {
      return;
    }

    try {
      // Create template parameters object
      const templateParams = {
        from_email: formData.email,
        purpose: formData.purpose,
        device_type: formData.deviceType,
        age_group: formData.ageGroup,
        budget_range: formData.budgetRange,
        features: formData.features.join(", "),
        software: formData.software,
        brand_preference: formData.brandPreference,
        accessories: formData.accessories.join(", "),
        additional_info: formData.additionalInfo,
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
              onBlur={handleBlur}
              className={`border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-400" : "focus:ring-blue-400"
              } focus:border-transparent`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
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
              <option value="graphicDesign">
                Graphic Design/Video Editing
              </option>
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

          {/* Features Field (Multi-select) */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="features" className="text-lg font-medium">
              What features are most important to you?
            </label>
            <select
              id="features"
              name="features"
              multiple
              value={formData.features}
              onChange={handleMultiSelectChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent min-h-[120px]"
              required
            >
              <option value="fastPerformance">Fast Performance</option>
              <option value="batteryLife">Long Battery Life</option>
              <option value="lightWeight">Lightweight</option>
              <option value="highResolution">High Resolution Display</option>
              <option value="gaming">Gaming Features</option>
              <option value="business">Business Features</option>
            </select>
          </div>

          {/* Software Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="software" className="text-lg font-medium">
              What software do you plan to use?
            </label>
            <input
              type="text"
              id="software"
              name="software"
              value={formData.software}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`border ${
                errors.software ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:outline-none focus:ring-2 ${
                errors.software ? "focus:ring-red-400" : "focus:ring-blue-400"
              } focus:border-transparent`}
              required
            />
            {errors.software && (
              <p className="text-red-500 text-sm mt-1">{errors.software}</p>
            )}
          </div>

          {/* Brand Preference */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="brandPreference" className="text-lg font-medium">
              Do you have any brand preferences?
            </label>
            <input
              type="text"
              id="brandPreference"
              name="brandPreference"
              value={formData.brandPreference}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`border ${
                errors.brandPreference ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:outline-none focus:ring-2 ${
                errors.brandPreference
                  ? "focus:ring-red-400"
                  : "focus:ring-blue-400"
              } focus:border-transparent`}
            />
            {errors.brandPreference && (
              <p className="text-red-500 text-sm mt-1">
                {errors.brandPreference}
              </p>
            )}
          </div>

          {/* Accessories (Multi-select) */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="accessories" className="text-lg font-medium">
              What accessories would you need?
            </label>
            <select
              id="accessories"
              name="accessories"
              multiple
              value={formData.accessories}
              onChange={handleMultiSelectChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent min-h-[120px]"
            >
              <option value="mouse">Mouse</option>
              <option value="keyboard">Keyboard</option>
              <option value="headphones">Headphones</option>
              <option value="charger">Charger</option>
              <option value="externalStorage">External Storage</option>
              <option value="case">Laptop Case</option>
            </select>
          </div>

          {/* Additional Information */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="additionalInfo" className="text-lg font-medium">
              Additional Information (Optional)
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`border ${
                errors.additionalInfo ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:outline-none focus:ring-2 ${
                errors.additionalInfo
                  ? "focus:ring-red-400"
                  : "focus:ring-blue-400"
              } focus:border-transparent min-h-[120px]`}
            />
            {errors.additionalInfo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.additionalInfo}
              </p>
            )}
            <p className="text-gray-500 text-sm">
              {200 - formData.additionalInfo.length} characters remaining
            </p>
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
