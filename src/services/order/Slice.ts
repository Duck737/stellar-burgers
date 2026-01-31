import { getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface IOrder {
  orders: TOrder[];
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IOrder = {
  orders: [],
  order: null,
  isLoading: false,
  error: null
};

export const ordersThunk = createAsyncThunk('feed/orders', getOrdersApi);

export const orderThunk = createAsyncThunk(
  'feed/order',
  async (order: number) => await getOrderByNumberApi(order)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ordersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(ordersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(ordersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось получить заказы';
      })
      .addCase(orderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(orderThunk.fulfilled, (state, action) => {
        state.order = action.payload.orders[0];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(orderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось получить заказ';
      });
  },
  selectors: {
    selectorOrderState: (state) => state,
    selectorOrders: (state) => state.orders,
    selectorOrder: (state) => state.order
  }
});

export const { selectorOrderState, selectorOrders, selectorOrder } =
  orderSlice.selectors;

export default orderSlice.reducer;
