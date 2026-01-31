import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientSlice } from './ingredients/Slice';
import { constructorSlice } from './burgerConstructor/Slice';
import { userSlice } from './user/Slice';
import { feedSlice } from './feed/Slice';
import { orderSlice } from './order/Slice';

export const rootReducer = combineReducers({
  ingredients: ingredientSlice.reducer,
  burgerConstructor: constructorSlice.reducer,
  user: userSlice.reducer,
  feed: feedSlice.reducer,
  order: orderSlice.reducer
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

// export const useDispatch = dispatchHook.withTypes<AppDispatch>();
// export const useSelector = selectorHook.withTypes<RootState>();

export default store;
