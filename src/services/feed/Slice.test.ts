import { feedSlice, initialState, feedThunk } from './Slice';
import { TOrder } from '@utils-types';

const feedReducer = feedSlice.reducer;

const mockOrders: TOrder[] = [
  {
    _id: 'order-1',
    status: 'done',
    name: 'Space бургер',
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T10:05:00.000Z',
    number: 12345,
    ingredients: ['ingredient-1', 'ingredient-2', 'ingredient-3']
  },
  {
    _id: 'order-2',
    status: 'pending',
    name: 'Галактический бургер',
    createdAt: '2024-01-02T12:00:00.000Z',
    updatedAt: '2024-01-02T12:10:00.000Z',
    number: 12346,
    ingredients: ['ingredient-1', 'ingredient-4']
  }
];

describe('feedSlice', () => {
  describe('начальное состояние', () => {
    test('должен возвращать начальное состояние', () => {
      const result = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result).toEqual(initialState);
    });

    test('начальное состояние должно иметь пустой массив заказов', () => {
      const result = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.orders).toEqual([]);
    });

    test('начальное состояние должно иметь totalToday равным 0', () => {
      const result = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.totalToday).toBe(0);
    });

    test('начальное состояние должно иметь total равным 0', () => {
      const result = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.total).toBe(0);
    });

    test('начальное состояние должно иметь isLoading равным false', () => {
      const result = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.isLoading).toBe(false);
    });

    test('начальное состояние должно иметь error равным null', () => {
      const result = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.error).toBeNull();
    });
  });

  describe('feedThunk', () => {
    describe('pending', () => {
      test('должен устанавливать isLoading в true при начале запроса', () => {
        const action = { type: feedThunk.pending.type };
        const result = feedReducer(initialState, action);

        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });

      test('должен сбрасывать ошибку при начале нового запроса', () => {
        const stateWithError = {
          ...initialState,
          error: 'Предыдущая ошибка'
        };

        const action = { type: feedThunk.pending.type };
        const result = feedReducer(stateWithError, action);

        expect(result.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('должен сохранять заказы при успешном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: feedThunk.fulfilled.type,
          payload: {
            orders: mockOrders,
            total: 1000,
            totalToday: 50
          }
        };
        const result = feedReducer(loadingState, action);

        expect(result.orders).toEqual(mockOrders);
        expect(result.total).toBe(1000);
        expect(result.totalToday).toBe(50);
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
      });

      test('должен устанавливать isLoading в false при успешном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: feedThunk.fulfilled.type,
          payload: {
            orders: [],
            total: 0,
            totalToday: 0
          }
        };
        const result = feedReducer(loadingState, action);

        expect(result.isLoading).toBe(false);
      });

      test('должен заменять существующие заказы новыми', () => {
        const existingState = {
          ...initialState,
          orders: [mockOrders[0]],
          total: 500,
          totalToday: 25,
          isLoading: true
        };

        const newOrders = [mockOrders[1]];

        const action = {
          type: feedThunk.fulfilled.type,
          payload: {
            orders: newOrders,
            total: 1500,
            totalToday: 75
          }
        };
        const result = feedReducer(existingState, action);

        expect(result.orders).toEqual(newOrders);
        expect(result.total).toBe(1500);
        expect(result.totalToday).toBe(75);
      });
    });

    describe('rejected', () => {
      test('должен сохранять ошибку при неудачном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: feedThunk.rejected.type,
          error: { message: 'Не удалось получить ленту заказов' }
        };
        const result = feedReducer(loadingState, action);

        expect(result.error).toBe('Не удалось получить ленту заказов');
        expect(result.isLoading).toBe(false);
      });

      test('должен устанавливать isLoading в false при ошибке', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: feedThunk.rejected.type,
          error: { message: 'Ошибка' }
        };
        const result = feedReducer(loadingState, action);

        expect(result.isLoading).toBe(false);
      });

      test('должен устанавливать ошибку по умолчанию при отсутствии message', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: feedThunk.rejected.type,
          error: {}
        };
        const result = feedReducer(loadingState, action);

        expect(result.error).toBe('Не удалось получить ленту заказов');
      });

      test('не должен изменять существующие заказы при ошибке', () => {
        const stateWithOrders = {
          ...initialState,
          orders: mockOrders,
          total: 1000,
          totalToday: 50,
          isLoading: true
        };

        const action = {
          type: feedThunk.rejected.type,
          error: { message: 'Ошибка' }
        };
        const result = feedReducer(stateWithOrders, action);

        // Заказы должны остаться прежними
        expect(result.orders).toEqual(mockOrders);
        expect(result.total).toBe(1000);
        expect(result.totalToday).toBe(50);
      });
    });
  });
});
