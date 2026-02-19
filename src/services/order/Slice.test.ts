import { orderSlice, initialState, ordersThunk, orderThunk } from './Slice';
import { TOrder } from '@utils-types';

const orderReducer = orderSlice.reducer;

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

const mockSingleOrder: TOrder = {
  _id: 'order-3',
  status: 'done',
  name: 'Космический бургер',
  createdAt: '2024-01-03T14:00:00.000Z',
  updatedAt: '2024-01-03T14:15:00.000Z',
  number: 12347,
  ingredients: ['ingredient-1', 'ingredient-2']
};

describe('orderSlice', () => {
  describe('начальное состояние', () => {
    test('должен возвращать начальное состояние', () => {
      const result = orderReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result).toEqual(initialState);
    });

    test('начальное состояние должно иметь пустой массив заказов', () => {
      const result = orderReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.orders).toEqual([]);
    });

    test('начальное состояние должно иметь order равным null', () => {
      const result = orderReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.order).toBeNull();
    });

    test('начальное состояние должно иметь isLoading равным false', () => {
      const result = orderReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.isLoading).toBe(false);
    });

    test('начальное состояние должно иметь error равным null', () => {
      const result = orderReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.error).toBeNull();
    });
  });

  describe('ordersThunk (получение списка заказов)', () => {
    describe('pending', () => {
      test('должен устанавливать isLoading в true при начале запроса', () => {
        const action = { type: ordersThunk.pending.type };
        const result = orderReducer(initialState, action);

        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });

      test('должен сбрасывать ошибку при начале нового запроса', () => {
        const stateWithError = {
          ...initialState,
          error: 'Предыдущая ошибка'
        };

        const action = { type: ordersThunk.pending.type };
        const result = orderReducer(stateWithError, action);

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
          type: ordersThunk.fulfilled.type,
          payload: mockOrders
        };
        const result = orderReducer(loadingState, action);

        expect(result.orders).toEqual(mockOrders);
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
      });

      test('должен устанавливать isLoading в false при успешном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: ordersThunk.fulfilled.type,
          payload: []
        };
        const result = orderReducer(loadingState, action);

        expect(result.isLoading).toBe(false);
      });

      test('должен заменять существующие заказы новыми', () => {
        const existingState = {
          ...initialState,
          orders: [mockOrders[0]],
          isLoading: true
        };

        const newOrders = [mockOrders[1]];

        const action = {
          type: ordersThunk.fulfilled.type,
          payload: newOrders
        };
        const result = orderReducer(existingState, action);

        expect(result.orders).toEqual(newOrders);
        expect(result.orders).toHaveLength(1);
      });
    });

    describe('rejected', () => {
      test('должен сохранять ошибку при неудачном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: ordersThunk.rejected.type,
          error: { message: 'Не удалось получить заказы' }
        };
        const result = orderReducer(loadingState, action);

        expect(result.error).toBe('Не удалось получить заказы');
        expect(result.isLoading).toBe(false);
      });

      test('должен устанавливать ошибку по умолчанию при отсутствии message', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: ordersThunk.rejected.type,
          error: {}
        };
        const result = orderReducer(loadingState, action);

        expect(result.error).toBe('Не удалось получить заказы');
      });
    });
  });

  describe('orderThunk (получение одного заказа по номеру)', () => {
    describe('pending', () => {
      test('должен устанавливать isLoading в true при начале запроса', () => {
        const action = { type: orderThunk.pending.type };
        const result = orderReducer(initialState, action);

        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });

      test('должен сбрасывать ошибку при начале нового запроса', () => {
        const stateWithError = {
          ...initialState,
          error: 'Предыдущая ошибка'
        };

        const action = { type: orderThunk.pending.type };
        const result = orderReducer(stateWithError, action);

        expect(result.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('должен сохранять заказ при успешном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: orderThunk.fulfilled.type,
          payload: { orders: [mockSingleOrder] }
        };
        const result = orderReducer(loadingState, action);

        expect(result.order).toEqual(mockSingleOrder);
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
      });

      test('должен устанавливать isLoading в false при успешном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: orderThunk.fulfilled.type,
          payload: { orders: [mockSingleOrder] }
        };
        const result = orderReducer(loadingState, action);

        expect(result.isLoading).toBe(false);
      });

      test('должен заменять существующий заказ новым', () => {
        const existingState = {
          ...initialState,
          order: mockOrders[0],
          isLoading: true
        };

        const action = {
          type: orderThunk.fulfilled.type,
          payload: { orders: [mockSingleOrder] }
        };
        const result = orderReducer(existingState, action);

        expect(result.order).toEqual(mockSingleOrder);
      });
    });

    describe('rejected', () => {
      test('должен сохранять ошибку при неудачном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: orderThunk.rejected.type,
          error: { message: 'Не удалось получить заказ' }
        };
        const result = orderReducer(loadingState, action);

        expect(result.error).toBe('Не удалось получить заказ');
        expect(result.isLoading).toBe(false);
      });

      test('должен устанавливать ошибку по умолчанию при отсутствии message', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: orderThunk.rejected.type,
          error: {}
        };
        const result = orderReducer(loadingState, action);

        expect(result.error).toBe('Не удалось получить заказ');
      });

      test('не должен изменять существующий заказ при ошибке', () => {
        const stateWithOrder = {
          ...initialState,
          order: mockSingleOrder,
          isLoading: true
        };

        const action = {
          type: orderThunk.rejected.type,
          error: { message: 'Ошибка' }
        };
        const result = orderReducer(stateWithOrder, action);

        expect(result.order).toEqual(mockSingleOrder);
      });
    });
  });
});
