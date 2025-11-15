// /store/slices/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

// Thunk for fetching all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/order`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);
      return data.orders;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/order/${orderId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();
      if (!data.success) return rejectWithValue(data.message);
      return orderId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    allOrders: [],
    pendingOrders: [],
    activeOrders: [],
    completedOrders: [],

    loading: false,
    error: null,

    selectedOrder: null,
    deletingOrder: null,
  },
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;

        // Split datasets
        state.pendingOrders = action.payload.filter(o => o.status === "pending");
        state.activeOrders = action.payload.filter(o =>
          o.status === "accepted" || o.status === "in_progress"
        );
        state.completedOrders = action.payload.filter(o => o.status === "completed");
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE ORDER
      .addCase(deleteOrder.pending, (state, action) => {
        state.deletingOrder = action.meta.arg;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const id = action.payload;

        // Remove from all datasets
        state.allOrders = state.allOrders.filter(o => o._id !== id);
        state.pendingOrders = state.pendingOrders.filter(o => o._id !== id);
        state.activeOrders = state.activeOrders.filter(o => o._id !== id);
        state.completedOrders = state.completedOrders.filter(o => o._id !== id);

        state.deletingOrder = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.deletingOrder = null;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
