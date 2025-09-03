/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


const API_URL = import.meta.env.VITE_API_URL;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const CreateOrder = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();

  const [fileType, setFileType] = useState("pdf");
  const [copies, setCopies] = useState(1);
  const [printType, setPrintType] = useState("color");
  const [paperSize, setPaperSize] = useState("A4");
  const [binding, setBinding] = useState("no");
  const [notes, setNotes] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);

  const [file, setFile] = useState(null);

  useEffect(() => {
    if (vendorId) {
      fetchVendorDetails();
    }
  }, [vendorId]);

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/vendors/${vendorId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setVendor(data.vendor);
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPageCount = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    return pdf.numPages;
  };

  const handleFile = async (file) => {
    setUploading(true);
    setUploadStatus("Uploading...");
    setFile(file);

    if (file.type === "application/pdf") {
      try {
        const pages = await getPageCount(file);
        setPageCount(pages);
      } catch (err) {
        console.error("Failed to read PDF:", err);
        setPageCount(1);
      }
    } else {
      setPageCount(1); // For other formats
    }

    setUploading(false);
    setUploadStatus("File selected.");
    handleFileUpload(file);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const allowedTypes = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      jpg: "image/jpeg",
      png: "image/png",
    };

    const expectedMime = allowedTypes[fileType];
    if (file.type !== expectedMime) {
      setUploadStatus(`Please upload a valid ${fileType.toUpperCase()} file.`);
      return;
    }

    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/signed-url`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      const { signedUrl, path } = await res.json();
      if (!signedUrl) throw new Error("Signed URL not received");

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const fullUrl = `${SUPABASE_URL}/storage/v1/object/public/printease/${path}`;
      console.log(fullUrl);
      setFileUrl(fullUrl);
      setUploadStatus("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      setUploadStatus("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const calculateTotal = () => {
    if (!vendor) return 0;

    const priceMap = vendor.prices;
    const perPageKey = printType === "color" ? "color" : "black_white";
    const pageSizePrice = priceMap?.[perPageKey]?.[paperSize] || 0;
    const bindingPrice = binding !== "no" ? priceMap?.binding?.[binding] || 0 : 0;

    const totalPages = pageCount * copies;
    const total = totalPages * pageSizePrice + bindingPrice;

    return total.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl) {
      alert("Please upload a file before submitting.");
      return;
    }

    const orderData = {
      fileUrl,
      totalPrice: parseFloat(calculateTotal()),
      pages: pageCount,
      color: printType === 'color' ? true : false,
      sets: copies,
      size: paperSize,
      binding: binding === 'no' ? 'none' : binding,
      notes,
      vendorId: vendorId || null,
    };

    console.log("Submitting order:", orderData);

    try {
      const response = await fetch(`${API_URL}/api/order/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("Order created successfully!");
        navigate("/u/cart");
      } else {
        alert("Failed to create order: " + data.message);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <main className="pt-32 md:pt-36 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black dark:bg-white mb-3 shadow-lg">
              <svg className="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Create New Order
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Configure your printing requirements</p>
          </div>

          {/* Loading State */}
          {loading && vendorId && (
            <div className="mb-6 p-4 bg-white dark:bg-black shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-b-2 border-black dark:border-white mr-2"></div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Loading vendor details...</span>
              </div>
            </div>
          )}

          {/* Vendor Info Card */}
          {vendor && (
            <div className="mb-6 p-4 bg-black dark:bg-white text-white dark:text-black shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 dark:bg-black/20 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{vendor.shopName || "Unnamed Shop"}</h3>
                    <p className="text-gray-300 dark:text-gray-700 flex items-center text-sm mt-0.5">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {vendor.location?.address || "Address not available"}
                    </p>
                  </div>
                </div>
                {vendor.contactNumber && (
                  <div className="flex items-center text-gray-300 dark:text-gray-700 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {vendor.contactNumber}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Form Container */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Order Details */}
            <div className="space-y-4">
              <div className="card p-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-900 flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Document Details</h2>
                </div>

                {/* File Type */}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium flex items-center text-sm">
                    <svg className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    File Type
                  </label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="input-field"
                  >
                    <option value="pdf">📄 PDF (.pdf)</option>
                    <option value="docx">📝 DOCX (.docx)</option>
                    <option value="jpg">🖼️ JPG (.jpg)</option>
                    <option value="png">🖼️ PNG (.png)</option>
                  </select>
                </div>

                {/* File Upload */}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium flex items-center text-sm">
                    <svg className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 text-center hover:border-black dark:hover:border-white transition-colors">
                    <input
                      type="file"
                      accept={
                        fileType === "pdf"
                          ? ".pdf"
                          : fileType === "docx"
                          ? ".docx"
                          : fileType === "jpg"
                          ? ".jpg"
                          : ".png"
                      }
                      onChange={(e) => handleFile(e.target.files[0])}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Supports {fileType.toUpperCase()} files</p>
                    </label>
                  </div>
                  {uploading && (
                    <div className="mt-2 flex items-center text-black dark:text-white text-sm">
                      <div className="animate-spin h-3 w-3 border-b-2 border-black dark:border-white mr-1"></div>
                      Uploading...
                    </div>
                  )}
                  {uploadStatus && (
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {uploadStatus}
                    </p>
                  )}
                </div>

                {/* Number of Copies */}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium flex items-center text-sm">
                    <svg className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    Number of Copies
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={copies}
                    onChange={(e) => setCopies(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Print Settings */}
              <div className="card p-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-900 flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Print Settings</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Print Type */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium text-sm">Print Type</label>
                    <select
                      value={printType}
                      onChange={(e) => setPrintType(e.target.value)}
                      className="input-field"
                    >
                      <option value="color">🎨 Color</option>
                      <option value="bw">⚫ Black & White</option>
                    </select>
                  </div>

                  {/* Paper Size */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium text-sm">Paper Size</label>
                    <select
                      value={paperSize}
                      onChange={(e) => setPaperSize(e.target.value)}
                      className="input-field"
                    >
                      <option value="A4">📄 A4</option>
                      <option value="A3">📄 A3</option>
                      <option value="Letter">📄 Letter</option>
                      <option value="Legal">📄 Legal</option>
                    </select>
                  </div>
                </div>

                {/* Binding */}
                <div className="mt-3">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium text-sm">Binding</label>
                  <select
                    value={binding}
                    onChange={(e) => setBinding(e.target.value)}
                    className="input-field"
                  >
                    <option value="no">❌ No Binding</option>
                    <option value="soft">📚 Soft Binding</option>
                    <option value="hard">📖 Hard Binding</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column - Notes and Summary */}
            <div className="space-y-4">
              {/* Notes */}
              <div className="card p-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-900 flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Special Instructions</h2>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field resize-none"
                  rows="4"
                  placeholder="Any special instructions for your order? (Optional)"
                />
              </div>

              {/* Order Summary */}
              <div className="bg-black dark:bg-white text-white dark:text-black shadow-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-white/20 dark:bg-black/20 flex items-center justify-center mr-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold">Order Summary</h2>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 dark:text-gray-700">Pages per copy:</span>
                    <span className="font-semibold">{pageCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 dark:text-gray-700">Total copies:</span>
                    <span className="font-semibold">{copies}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 dark:text-gray-700">Print type:</span>
                    <span className="font-semibold capitalize">{printType === "bw" ? "Black & White" : "Color"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 dark:text-gray-700">Paper size:</span>
                    <span className="font-semibold">{paperSize}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 dark:text-gray-700">Binding:</span>
                    <span className="font-semibold capitalize">{binding === "no" ? "None" : binding}</span>
                  </div>
                </div>

                <div className="border-t border-gray-300 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Cost:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => (vendorId ? navigate("/u/vendors") : navigate("/u/home"))}
                  className="btn-secondary flex-1 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {vendorId ? "Back to Vendors" : "Cancel"}
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateOrder;
