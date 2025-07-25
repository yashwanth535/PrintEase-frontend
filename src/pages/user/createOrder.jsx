import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../components/user/header";

const API_URL = import.meta.env.VITE_API_URL;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const CreateOrder = () => {
  const navigate = useNavigate();

  const [fileType, setFileType] = useState("pdf");
  const [copies, setCopies] = useState(1);
  const [printType, setPrintType] = useState("color");
  const [paperSize, setPaperSize] = useState("A4");
  const [notes, setNotes] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

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
      const res = await fetch(`${API_URL}/api/file/signed-url`, {
        method: "POST",
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

      const fullUrl = `${SUPABASE_URL}/storage/v1/object/public/your-bucket-name/${path}`;
      setFileUrl(fullUrl);
      setUploadStatus("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      setUploadStatus("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fileUrl) {
      alert("Please upload a file before submitting.");
      return;
    }

    const orderData = {
      fileUrl,
      fileType,
      copies,
      printType,
      paperSize,
      notes,
    };

    console.log("Submitting order:", orderData);

    // TODO: POST to backend here
    navigate("/u/cart");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <UserHeader />
      <main className="flex-1 flex flex-col items-center justify-start pt-32 md:pt-36">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Order</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Type Dropdown */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">File Type</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="pdf">PDF (.pdf)</option>
                <option value="docx">DOCX (.docx)</option>
                <option value="jpg">JPG (.jpg)</option>
                <option value="png">PNG (.png)</option>
              </select>
            </div>

            {/* Upload File */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Upload File</label>
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
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="w-full"
              />
              {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
              {uploadStatus && <p className="text-sm mt-2">{uploadStatus}</p>}
            </div>

            {/* Number of Copies */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Number of Copies</label>
              <input
                type="number"
                min="1"
                value={copies}
                onChange={(e) => setCopies(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Print Type */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Print Type</label>
              <select
                value={printType}
                onChange={(e) => setPrintType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="color">Color</option>
                <option value="bw">Black & White</option>
              </select>
            </div>

            {/* Paper Size */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Paper Size</label>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Any special instructions?"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => navigate("/u/home")}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow"
              >
                Submit Order
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateOrder;
