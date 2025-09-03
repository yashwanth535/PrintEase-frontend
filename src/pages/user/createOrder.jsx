/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Upload, Copy, Settings, Edit3, Calculator, ShoppingCart, ArrowLeft, Check, Store, MapPin, Phone } from "lucide-react";

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
    <div className="min-h-screen minimal-gradient">
      <main className="max-w-6xl mx-auto px-4 py-8 pt-24 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Header Section */}
          <div className="feature-card floating p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Create New Order
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Configure your printing requirements
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && vendorId && (
            <div className="feature-card floating p-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-slate-600 dark:text-slate-400 text-sm">Loading vendor details...</span>
              </div>
            </div>
          )}

          {/* Vendor Info Card */}
          {vendor && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="feature-card floating p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white">
                    <Store size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {vendor.shopName || "Unnamed Shop"}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 flex items-center text-sm mt-1">
                      <MapPin size={14} className="mr-1" />
                      {vendor.location?.address || "Address not available"}
                    </p>
                  </div>
                </div>
                {vendor.contactNumber && (
                  <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                    <Phone size={16} className="mr-2" />
                    {vendor.contactNumber}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Main Form Container */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Order Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="feature-card floating p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white">
                    <FileText size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Document Details</h2>
                </div>

                {/* File Type */}
                <div className="mb-6">
                  <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium text-sm">
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
                <div className="mb-6">
                  <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium text-sm">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
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
                      <Upload size={32} className="text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Supports {fileType.toUpperCase()} files</p>
                    </label>
                  </div>
                  {uploading && (
                    <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400 text-sm">
                      <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400 mr-2"></div>
                      Uploading...
                    </div>
                  )}
                  {uploadStatus && (
                    <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 flex items-center">
                      <Check size={16} className="mr-2" />
                      {uploadStatus}
                    </p>
                  )}
                </div>

                {/* Number of Copies */}
                <div className="mb-6">
                  <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium text-sm">
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
              <div className="feature-card floating p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white">
                    <Settings size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Print Settings</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Print Type */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium text-sm">Print Type</label>
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
                    <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium text-sm">Paper Size</label>
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
                <div className="mt-4">
                  <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium text-sm">Binding</label>
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
            </motion.div>

            {/* Right Column - Notes and Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Notes */}
              <div className="feature-card floating p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg text-white">
                    <Edit3 size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Special Instructions</h2>
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
              <div className="feature-card floating p-6 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-50 text-white dark:text-slate-900">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 dark:bg-slate-900/20 rounded-lg">
                    <Calculator size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Order Summary</h2>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300 dark:text-slate-600">Pages per copy:</span>
                    <span className="font-semibold">{pageCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300 dark:text-slate-600">Total copies:</span>
                    <span className="font-semibold">{copies}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300 dark:text-slate-600">Print type:</span>
                    <span className="font-semibold capitalize">{printType === "bw" ? "Black & White" : "Color"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300 dark:text-slate-600">Paper size:</span>
                    <span className="font-semibold">{paperSize}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300 dark:text-slate-600">Binding:</span>
                    <span className="font-semibold capitalize">{binding === "no" ? "None" : binding}</span>
                  </div>
                </div>

                <div className="border-t border-slate-300/30 dark:border-slate-600/30 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Cost:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => (vendorId ? navigate("/u/vendors") : navigate("/u/home"))}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  {vendorId ? "Back to Vendors" : "Cancel"}
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Submit Order
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateOrder;
