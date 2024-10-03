import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaUser, FaEnvelope, FaStar, FaArrowUp, FaCommentDots } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FeedbackForm() {
  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitted");

    const formElement = e.target;
    const formData = new FormData(formElement);
    const formDataSerialized = new URLSearchParams(formData).toString();
    console.log("Serialized form data: ", formDataSerialized);

    // Use the GoogleGenerativeAI to generate a report
    const genAI = new GoogleGenerativeAI("AIzaSyCxu1PvQahgfwQLSVMgmUzgKAFSeApC2c0"); 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Create a Short 100 words and human friendly report based on following point and skip adding name ,strong area, improvement area and feedback in report:
      Name: ${formData.get("Name")}
      Strong Area: ${formData.get("StrongArea")}
      Improvement Area: ${formData.get("ImprovementArea")}
      Feedback: ${formData.get("Feedback")}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const report = await response.text();
    console.log(report);

    formData.append("Report", report);

    fetch("https://script.google.com/macros/s/AKfycbwzU8nxSL-AYqLjVPBQCEPlRABk10AdEq0az2X8v1X7xx-GwVfTkPzy9DzC1G6HrmEFNA/exec", {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(formData).toString(),
    }).then(response => response.text())
      .then(result => {
        console.log(result);
        formElement.reset();
        toast.success('Feedback submitted successfully!', {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      })
      .catch(error => console.error('Error:', error));
  }

  return (
    <div className="flex items-center justify-center h-auto p-4 sm:p-6 lg:p-8 w-screen">
      <div className="FeedbackForm w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Feedback Form</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              <FaUser className="inline-block mr-2 text-blue-500" /> Name
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Name"
              name="Name"
              type="text"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              <FaEnvelope className="inline-block mr-2 text-blue-500" /> Email
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Email"
              name="Email"
              type="email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              <FaStar className="inline-block mr-2 text-blue-500" /> Strong Area
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Strong Area"
              name="StrongArea"
              type="text"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              <FaArrowUp className="inline-block mr-2 text-blue-500" /> Improvement Area
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Improvement Area"
              name="ImprovementArea"
              type="text"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              <FaCommentDots className="inline-block mr-2 text-blue-500" /> Feedback
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Feedback"
              name="Feedback"
              rows="4"
              required
            ></textarea>
          </div>
          <div>
            <button
              className="w-full bg-blue-500 text-white p-3 rounded-lg transition-colors duration-200"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default FeedbackForm;

