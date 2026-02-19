import {
  constructorSlice,
  initialState,
  addIngredient,
  removeIngredient,
  moveUp,
  moveDown
} from './Slice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const constructorReducer = constructorSlice.reducer;

const mockBun: TIngredient = {
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
};

const mockIngredient: TIngredient = {
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
};

const mockSauce: TIngredient = {
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
};

describe('constructorSlice', () => {
  describe('начальное состояние', () => {
    test('должен возвращать начальное состояние', () => {
      const result = constructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result).toEqual(initialState);
    });
  });
  // Обработка экшена добавления ингредиента
  describe('addIngredient', () => {
    test('должен добавлять булку в конструктор', () => {
      const action = addIngredient(mockBun);
      const result = constructorReducer(initialState, action);

      expect(result.burgerConstructor.bun).toEqual(
        expect.objectContaining({
          ...mockBun,
          id: expect.any(String)
        })
      );
      expect(result.burgerConstructor.ingredients).toHaveLength(0);
    });

    test('должен заменять булку при повторном добавлении', () => {
      const anotherBun: TIngredient = {
        ...mockBun,
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3'
      };

      const action1 = addIngredient(mockBun);
      const state1 = constructorReducer(initialState, action1);

      const action2 = addIngredient(anotherBun);
      const result = constructorReducer(state1, action2);

      expect(result.burgerConstructor.bun).toEqual(
        expect.objectContaining({
          ...anotherBun,
          id: expect.any(String)
        })
      );
    });

    test('должен добавлять ингредиент (не булку) в список', () => {
      const action = addIngredient(mockIngredient);
      const result = constructorReducer(initialState, action);

      expect(result.burgerConstructor.ingredients).toHaveLength(1);
      expect(result.burgerConstructor.ingredients[0]).toEqual(
        expect.objectContaining({
          ...mockIngredient,
          id: expect.any(String)
        })
      );
      expect(result.burgerConstructor.bun).toBeNull();
    });

    test('должен добавлять несколько ингредиентов', () => {
      const action1 = addIngredient(mockIngredient);
      const state1 = constructorReducer(initialState, action1);

      const action2 = addIngredient(mockSauce);
      const result = constructorReducer(state1, action2);

      expect(result.burgerConstructor.ingredients).toHaveLength(2);
    });
  });
  // Обработка экшена удаления ингредиента
  describe('removeIngredient', () => {
    test('должен удалять ингредиент по id', () => {
      const ingredientWithId: TConstructorIngredient = {
        ...mockIngredient,
        id: 'test-id-123'
      };

      const stateWithIngredient = {
        ...initialState,
        burgerConstructor: {
          bun: null,
          ingredients: [ingredientWithId]
        }
      };

      const action = removeIngredient({ id: 'test-id-123' });
      const result = constructorReducer(stateWithIngredient, action);

      expect(result.burgerConstructor.ingredients).toHaveLength(0);
    });

    test('должен удалять только указанный ингредиент', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-1'
      };
      const ingredient2: TConstructorIngredient = {
        ...mockSauce,
        id: 'id-2'
      };

      const stateWithIngredients = {
        ...initialState,
        burgerConstructor: {
          bun: null,
          ingredients: [ingredient1, ingredient2]
        }
      };

      const action = removeIngredient({ id: 'id-1' });
      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burgerConstructor.ingredients).toHaveLength(1);
      expect(result.burgerConstructor.ingredients[0].id).toBe('id-2');
    });

    test('не должен изменять список, если id не найден', () => {
      const ingredientWithId: TConstructorIngredient = {
        ...mockIngredient,
        id: 'existing-id'
      };

      const stateWithIngredient = {
        ...initialState,
        burgerConstructor: {
          bun: null,
          ingredients: [ingredientWithId]
        }
      };

      const action = removeIngredient({ id: 'non-existing-id' });
      const result = constructorReducer(stateWithIngredient, action);

      expect(result.burgerConstructor.ingredients).toHaveLength(1);
    });
  });
  // Обработка экшена изменения порядка ингредиентов в начинке
  describe('moveUp', () => {
    test('должен перемещать ингредиент вверх', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        id: 'first'
      };
      const ingredient2: TConstructorIngredient = {
        ...mockSauce,
        id: 'second'
      };

      const stateWithIngredients = {
        ...initialState,
        burgerConstructor: {
          bun: null,
          ingredients: [ingredient1, ingredient2]
        }
      };

      const action = moveUp(1);
      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burgerConstructor.ingredients[0].id).toBe('second');
      expect(result.burgerConstructor.ingredients[1].id).toBe('first');
    });

    test('не должен перемещать первый элемент вверх', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        id: 'first'
      };
      const ingredient2: TConstructorIngredient = {
        ...mockSauce,
        id: 'second'
      };

      const stateWithIngredients = {
        ...initialState,
        burgerConstructor: {
          bun: null,
          ingredients: [ingredient1, ingredient2]
        }
      };

      const action = moveUp(0);
      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burgerConstructor.ingredients[0].id).toBe('first');
      expect(result.burgerConstructor.ingredients[1].id).toBe('second');
    });
  });

  describe('moveDown', () => {
    test('должен перемещать ингредиент вниз', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        id: 'first'
      };
      const ingredient2: TConstructorIngredient = {
        ...mockSauce,
        id: 'second'
      };

      const stateWithIngredients = {
        ...initialState,
        burgerConstructor: {
          bun: null,
          ingredients: [ingredient1, ingredient2]
        }
      };

      const action = moveDown(0);
      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burgerConstructor.ingredients[0].id).toBe('second');
      expect(result.burgerConstructor.ingredients[1].id).toBe('first');
    });

    test('не должен перемещать последний элемент вниз', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        id: 'first'
      };
      const ingredient2: TConstructorIngredient = {
        ...mockSauce,
        id: 'second'
      };

      const stateWithIngredients = {
        ...initialState,
        burgerConstructor: {
          bun: null,
          ingredients: [ingredient1, ingredient2]
        }
      };

      const action = moveDown(1);
      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burgerConstructor.ingredients[0].id).toBe('first');
      expect(result.burgerConstructor.ingredients[1].id).toBe('second');
    });
  });
});
