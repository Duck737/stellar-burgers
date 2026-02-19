import { ingredientSlice, initialState, getIngredientThunk } from './Slice';
import { TIngredient } from '@utils-types';

const ingredientReducer = ingredientSlice.reducer;

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  }
];

describe('ingredientSlice', () => {
  describe('начальное состояние', () => {
    test('должен возвращать начальное состояние', () => {
      const result = ingredientReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result).toEqual(initialState);
    });

    test('начальное состояние должно иметь пустой массив ингредиентов', () => {
      const result = ingredientReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.ingredients).toEqual([]);
    });

    test('начальное состояние должно иметь isLoading равным false', () => {
      const result = ingredientReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.isLoading).toBe(false);
    });

    test('начальное состояние должно иметь error равным null', () => {
      const result = ingredientReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.error).toBeNull();
    });
  });

  describe('getIngredientThunk', () => {
    describe('pending', () => {
      test('должен устанавливать isLoading в true при начале запроса', () => {
        const action = { type: getIngredientThunk.pending.type };
        const result = ingredientReducer(initialState, action);

        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });

      test('должен сбрасывать ошибку при начале нового запроса', () => {
        const stateWithError = {
          ...initialState,
          error: 'Предыдущая ошибка'
        };

        const action = { type: getIngredientThunk.pending.type };
        const result = ingredientReducer(stateWithError, action);

        expect(result.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('должен сохранять ингредиенты при успешном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: getIngredientThunk.fulfilled.type,
          payload: mockIngredients
        };
        const result = ingredientReducer(loadingState, action);

        expect(result.ingredients).toEqual(mockIngredients);
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
      });

      test('должен устанавливать isLoading в false при успешном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: getIngredientThunk.fulfilled.type,
          payload: mockIngredients
        };
        const result = ingredientReducer(loadingState, action);

        expect(result.isLoading).toBe(false);
      });

      test('должен заменять существующие ингредиенты новыми', () => {
        const existingState = {
          ...initialState,
          ingredients: [mockIngredients[0]],
          isLoading: true
        };

        const newIngredients = [mockIngredients[1], mockIngredients[2]];

        const action = {
          type: getIngredientThunk.fulfilled.type,
          payload: newIngredients
        };
        const result = ingredientReducer(existingState, action);

        expect(result.ingredients).toEqual(newIngredients);
        expect(result.ingredients).toHaveLength(2);
      });

      test('должен обрабатывать пустой массив ингредиентов', () => {
        const loadingState = {
          ...initialState,
          isLoading: true,
          ingredients: mockIngredients
        };

        const action = {
          type: getIngredientThunk.fulfilled.type,
          payload: []
        };
        const result = ingredientReducer(loadingState, action);

        expect(result.ingredients).toEqual([]);
        expect(result.isLoading).toBe(false);
      });
    });

    describe('rejected', () => {
      test('должен сохранять ошибку при неудачном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: getIngredientThunk.rejected.type,
          error: { message: 'Ошибка загрузки ингредиентов' }
        };
        const result = ingredientReducer(loadingState, action);

        expect(result.error).toBe('Ошибка загрузки ингредиентов');
        expect(result.isLoading).toBe(false);
      });

      test('должен устанавливать isLoading в false при ошибке', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: getIngredientThunk.rejected.type,
          error: { message: 'Ошибка' }
        };
        const result = ingredientReducer(loadingState, action);

        expect(result.isLoading).toBe(false);
      });

      test('должен устанавливать ошибку по умолчанию при отсутствии message', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: getIngredientThunk.rejected.type,
          error: {}
        };
        const result = ingredientReducer(loadingState, action);

        expect(result.error).toBe('Ошибка');
      });

      test('не должен изменять существующие ингредиенты при ошибке', () => {
        const stateWithIngredients = {
          ...initialState,
          ingredients: mockIngredients,
          isLoading: true
        };

        const action = {
          type: getIngredientThunk.rejected.type,
          error: { message: 'Ошибка' }
        };
        const result = ingredientReducer(stateWithIngredients, action);

        expect(result.ingredients).toEqual(mockIngredients);
      });
    });
  });

  describe('селекторы', () => {
    test('selectorIngredientsState должен возвращать полное состояние слайса', () => {
      const sliceState = {
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      };

      const result = ingredientSlice.getInitialState();
      expect(result).toEqual(initialState);
    });

    test('selectorIngredientsData должен возвращать массив ингредиентов из начального состояния', () => {
      const result = ingredientSlice.getInitialState();
      expect(result.ingredients).toEqual([]);
    });
  });
});
