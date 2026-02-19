import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface IFeed {
  orders: TOrder[];
  totalToday: number;
  total: number;
  isLoading: boolean;
  error: string | null;
}

export const initialState: IFeed = {
  orders: [],
  totalToday: 0,
  total: 0,
  isLoading: false,
  error: null
};

export const feedThunk = createAsyncThunk('/orders/all', getFeedsApi);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(feedThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.totalToday = action.payload.totalToday;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(feedThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось получить ленту заказов';
      });
  },
  selectors: {
    selectorFeedState: (state) => state,
    selectorFeedData: (state) => state.orders,
    selectorFeedTotalToday: (state) => state.totalToday,
    selectorFeedTotal: (state) => state.total
  }
});

export const {
  selectorFeedState,
  selectorFeedData,
  selectorFeedTotalToday,
  selectorFeedTotal
} = feedSlice.selectors;

export default feedSlice.reducer;
