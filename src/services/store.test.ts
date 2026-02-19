import { rootReducer } from './store';
import { initialState as ingredientsInitialState } from './ingredients/Slice';
import { initialState as constructorInitialState } from './burgerConstructor/Slice';
import { initialState as userInitialState } from './user/Slice';
import { initialState as feedInitialState } from './feed/Slice';
import { initialState as orderInitialState } from './order/Slice';

// Тест, проверяющий правильную настройку и работу rootReducer
describe('rootReducer', () => {
  test('должен возвращать начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(result).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      user: userInitialState,
      feed: feedInitialState,
      order: orderInitialState
    });
  });

  test('должен правильно инициализировать все слайсы', () => {
    const result = rootReducer(undefined, { type: '@@INIT' });

    expect(result).toHaveProperty('ingredients');
    expect(result).toHaveProperty('burgerConstructor');
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('feed');
    expect(result).toHaveProperty('order');
  });

  test('состояние ingredients должно соответствовать начальному', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(result.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  test('состояние burgerConstructor должно соответствовать начальному', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(result.burgerConstructor).toEqual({
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      isOrderRequest: false,
      orderModalData: null,
      isLoading: false,
      error: null
    });
  });

  test('состояние user должно соответствовать начальному', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(result.user).toEqual({
      user: null,
      isAuth: false,
      isAuthChecked: false,
      isLoading: false,
      error: null
    });
  });

  test('состояние feed должно соответствовать начальному', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(result.feed).toEqual({
      orders: [],
      totalToday: 0,
      total: 0,
      isLoading: false,
      error: null
    });
  });

  test('состояние order должно соответствовать начальному', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(result.order).toEqual({
      orders: [],
      order: null,
      isLoading: false,
      error: null
    });
  });
});
