import { orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';

export interface IConstructorState {
  burgerConstructor: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  isOrderRequest: boolean;
  orderModalData: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: IConstructorState = {
  burgerConstructor: {
    bun: null,
    ingredients: []
  },
  isOrderRequest: false,
  orderModalData: null,
  isLoading: false,
  error: null
};

export const burgerThunk = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.burgerConstructor.bun = action.payload;
        } else {
          state.burgerConstructor.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action) => {
      state.burgerConstructor.ingredients =
        state.burgerConstructor.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload.id
        );
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    setRequest: (state, action) => {
      state.isOrderRequest = action.payload;
    },
    moveUp: (state, action) => {
      const index = action.payload;
      if (index > 0) {
        [
          state.burgerConstructor.ingredients[index],
          state.burgerConstructor.ingredients[index - 1]
        ] = [
          state.burgerConstructor.ingredients[index - 1],
          state.burgerConstructor.ingredients[index]
        ];
      }
    },
    moveDown: (state, action) => {
      const index = action.payload;
      if (index < state.burgerConstructor.ingredients.length - 1) {
        [
          state.burgerConstructor.ingredients[index],
          state.burgerConstructor.ingredients[index + 1]
        ] = [
          state.burgerConstructor.ingredients[index + 1],
          state.burgerConstructor.ingredients[index]
        ];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(burgerThunk.pending, (state) => {
        state.isLoading = true;
        state.isOrderRequest = true;
        state.error = null;
      })
      .addCase(burgerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.burgerConstructor = { bun: null, ingredients: [] };
        state.isOrderRequest = false;
        state.orderModalData = action.payload.order;
        state.error = null;
      })
      .addCase(burgerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isOrderRequest = false;
        state.error = action.error.message || 'Ошибка';
      });
  },
  selectors: {
    selectorConstructorState: (state) => state,
    selectorConstructorData: (state) => state.burgerConstructor,
    selectorOrderRequest: (state) => state.isOrderRequest,
    selectorOrderModalData: (state) => state.orderModalData
  }
});

export const {
  addIngredient,
  removeIngredient,
  clearOrderModalData,
  setRequest,
  moveDown,
  moveUp
} = constructorSlice.actions;

export const {
  selectorConstructorState,
  selectorConstructorData,
  selectorOrderModalData,
  selectorOrderRequest
} = constructorSlice.selectors;

export default constructorSlice.reducer;
