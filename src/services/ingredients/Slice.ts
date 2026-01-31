import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export interface IIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const getIngredientThunk = createAsyncThunk(
  'ingredients/items',
  getIngredientsApi
);

export const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectorIngredientsState: (state) => state,
    selectorIngredientsData: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredientThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.error = null;
      })
      .addCase(getIngredientThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка';
      });
  }
});

export const { selectorIngredientsState, selectorIngredientsData } =
  ingredientSlice.selectors;
export default ingredientSlice.reducer;
