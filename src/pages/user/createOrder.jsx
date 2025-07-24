import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../components/user/header";

const defaultItem = () => ({
  itemName: "",
  file: null,
  copies: 1,
  printType: "color",
  paperSize: "A4",
  notes: ""
});

const CreateOrder = () => {
  const navigate = useNavigate();
  const [orderName, setOrderName] = useState("");
  const [items, setItems] = useState([defaultItem()]);

  const handleItemChange = (idx, e) => {
    const { name, value, type, files } = e.target;
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, [name]: type === "file" ? files[0] : value } : item
      )
    );
  };

  const addItem = () => setItems((prev) => [...prev, defaultItem()]);
  const removeItem = (idx) => setItems((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate adding to cart/pending orders (could use localStorage or context)
    alert("Order submitted! Items added to cart and pending orders. (Implement backend integration)");
    navigate("/u/cart");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <UserHeader />
      <main className="flex-1 flex flex-col items-center justify-start pt-32 md:pt-36">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Order</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Order Name</label>
              <input
                type="text"
                name="orderName"
                value={orderName}
                onChange={e => setOrderName(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="space-y-8">
              {items.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4 relative bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-700">Item {idx + 1}</h3>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">Item Name</label>
                      <input
                        type="text"
                        name="itemName"
                        value={item.itemName}
                        onChange={e => handleItemChange(idx, e)}
                        required
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">File Upload</label>
                      <input
                        type="file"
                        name="file"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        onChange={e => handleItemChange(idx, e)}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">Number of Copies</label>
                      <input
                        type="number"
                        name="copies"
                        min="1"
                        value={item.copies}
                        onChange={e => handleItemChange(idx, e)}
                        required
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">Print Type</label>
                      <select
                        name="printType"
                        value={item.printType}
                        onChange={e => handleItemChange(idx, e)}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="color">Color</option>
                        <option value="bw">Black & White</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">Paper Size</label>
                      <select
                        name="paperSize"
                        value={item.paperSize}
                        onChange={e => handleItemChange(idx, e)}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="A4">A4</option>
                        <option value="A3">A3</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-1 font-medium">Notes</label>
                      <textarea
                        name="notes"
                        value={item.notes}
                        onChange={e => handleItemChange(idx, e)}
                        rows={2}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Any special instructions?"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 rounded bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                >
                  + Add Item
                </button>
              </div>
            </div>
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
