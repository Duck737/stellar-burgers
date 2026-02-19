import {
  userSlice,
  initialState,
  loginThunk,
  registerThunk,
  logoutThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  getUserThunk,
  updateUserThunk,
  clearError
} from './Slice';
import { TUser } from '@utils-types';

const userReducer = userSlice.reducer;

const mockUser: TUser = {
  email: 'test@test.com',
  name: 'Test User'
};

describe('userSlice', () => {
  describe('начальное состояние', () => {
    test('должен возвращать начальное состояние', () => {
      const result = userReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result).toEqual(initialState);
    });

    test('начальное состояние должно иметь user равным null', () => {
      const result = userReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.user).toBeNull();
    });

    test('начальное состояние должно иметь isAuth равным false', () => {
      const result = userReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.isAuth).toBe(false);
    });

    test('начальное состояние должно иметь isAuthChecked равным false', () => {
      const result = userReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(result.isAuthChecked).toBe(false);
    });
  });

  describe('clearError', () => {
    test('должен очищать ошибку', () => {
      const stateWithError = {
        ...initialState,
        error: 'Некоторая ошибка'
      };

      const action = clearError();
      const result = userReducer(stateWithError, action);

      expect(result.error).toBeNull();
    });
  });

  describe('loginThunk', () => {
    describe('pending', () => {
      test('должен устанавливать isLoading в true при начале запроса', () => {
        const action = { type: loginThunk.pending.type };
        const result = userReducer(initialState, action);

        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('должен сохранять пользователя и устанавливать isAuth в true', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: loginThunk.fulfilled.type,
          payload: { user: mockUser }
        };
        const result = userReducer(loadingState, action);

        expect(result.user).toEqual(mockUser);
        expect(result.isAuth).toBe(true);
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
          type: loginThunk.rejected.type,
          error: { message: 'Ошибка авторизации' }
        };
        const result = userReducer(loadingState, action);

        expect(result.error).toBe('Ошибка авторизации');
        expect(result.isLoading).toBe(false);
      });

      test('должен устанавливать ошибку по умолчанию при отсутствии message', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: loginThunk.rejected.type,
          error: {}
        };
        const result = userReducer(loadingState, action);

        expect(result.error).toBe('Ошибка авторизации');
      });
    });
  });

  describe('registerThunk', () => {
    describe('pending', () => {
      test('должен устанавливать isLoading в true при начале запроса', () => {
        const action = { type: registerThunk.pending.type };
        const result = userReducer(initialState, action);

        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('должен сохранять пользователя и устанавливать isAuth в true', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: registerThunk.fulfilled.type,
          payload: mockUser
        };
        const result = userReducer(loadingState, action);

        expect(result.user).toEqual(mockUser);
        expect(result.isAuth).toBe(true);
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
          type: registerThunk.rejected.type,
          error: { message: 'Ошибка регистрации' }
        };
        const result = userReducer(loadingState, action);

        expect(result.error).toBe('Ошибка регистрации');
        expect(result.isLoading).toBe(false);
      });
    });
  });

  describe('logoutThunk', () => {
    describe('pending', () => {
      test('должен устанавливать isLoading в true при начале запроса', () => {
        const action = { type: logoutThunk.pending.type };
        const result = userReducer(initialState, action);

        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('должен очищать пользователя и устанавливать isAuth в false', () => {
        const loggedInState = {
          ...initialState,
          user: mockUser,
          isAuth: true,
          isLoading: true
        };

        const action = { type: logoutThunk.fulfilled.type };
        const result = userReducer(loggedInState, action);

        expect(result.user).toBeNull();
        expect(result.isAuth).toBe(false);
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
          type: logoutThunk.rejected.type,
          error: { message: 'Ошибка логаута' }
        };
        const result = userReducer(loadingState, action);

        expect(result.error).toBe('Ошибка логаута');
        expect(result.isLoading).toBe(false);
      });
    });
  });

  describe('forgotPasswordThunk', () => {
    describe('pending', () => {
      test('должен устанавливать isLoading в true при начале запроса', () => {
        const action = { type: forgotPasswordThunk.pending.type };
        const result = userReducer(initialState, action);

        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('должен сбрасывать isLoading при успешном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = { type: forgotPasswordThunk.fulfilled.type };
        const result = userReducer(loadingState, action);

        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
      });
    });

    describe('rejected', () => {
      test('должен сохранять ошибку при неудачном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: forgotPasswordThunk.rejected.type,
          error: { message: 'Ошибка восстановления пароля' }
        };
        const result = userReducer(loadingState, action);

        expect(result.error).toBe('Ошибка восстановления пароля');
        expect(result.isLoading).toBe(false);
      });
    });
  });

  describe('resetPasswordThunk', () => {
    describe('pending', () => {
      test('должен устанавливать isLoading в true при начале запроса', () => {
        const action = { type: resetPasswordThunk.pending.type };
        const result = userReducer(initialState, action);

        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('должен сбрасывать isLoading при успешном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = { type: resetPasswordThunk.fulfilled.type };
        const result = userReducer(loadingState, action);

        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
      });
    });

    describe('rejected', () => {
      test('должен сохранять ошибку при неудачном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: resetPasswordThunk.rejected.type,
          error: { message: 'Ошибка сброса пароля' }
        };
        const result = userReducer(loadingState, action);

        expect(result.error).toBe('Ошибка сброса пароля');
        expect(result.isLoading).toBe(false);
      });
    });
  });

  describe('getUserThunk', () => {
    describe('pending', () => {
      test('должен устанавливать isLoading в true при начале запроса', () => {
        const action = { type: getUserThunk.pending.type };
        const result = userReducer(initialState, action);

        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('должен сохранять пользователя и устанавливать флаги аутентификации', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: getUserThunk.fulfilled.type,
          payload: { user: mockUser }
        };
        const result = userReducer(loadingState, action);

        expect(result.user).toEqual(mockUser);
        expect(result.isAuth).toBe(true);
        expect(result.isAuthChecked).toBe(true);
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
      });
    });

    describe('rejected', () => {
      test('должен устанавливать isAuthChecked в true и сбрасывать isAuth', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: getUserThunk.rejected.type,
          error: { message: 'Ошибка получения данных пользователя' }
        };
        const result = userReducer(loadingState, action);

        expect(result.isAuth).toBe(false);
        expect(result.isAuthChecked).toBe(true);
        expect(result.error).toBe('Ошибка получения данных пользователя');
        expect(result.isLoading).toBe(false);
      });
    });
  });

  describe('updateUserThunk', () => {
    describe('pending', () => {
      test('должен устанавливать isLoading в true при начале запроса', () => {
        const action = { type: updateUserThunk.pending.type };
        const result = userReducer(initialState, action);

        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('fulfilled', () => {
      test('должен обновлять пользователя', () => {
        const loadingState = {
          ...initialState,
          user: mockUser,
          isAuth: true,
          isLoading: true
        };

        const updatedUser = { ...mockUser, name: 'Updated User' };

        const action = {
          type: updateUserThunk.fulfilled.type,
          payload: { user: updatedUser }
        };
        const result = userReducer(loadingState, action);

        expect(result.user).toEqual(updatedUser);
        expect(result.isAuth).toBe(true);
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
      });
    });

    describe('rejected', () => {
      test('должен сохранять ошибку при неудачном запросе', () => {
        const loadingState = {
          ...initialState,
          isLoading: true
        };

        const action = {
          type: updateUserThunk.rejected.type,
          error: { message: 'Ошибка обновления данных пользователя' }
        };
        const result = userReducer(loadingState, action);

        expect(result.error).toBe('Ошибка обновления данных пользователя');
        expect(result.isLoading).toBe(false);
      });
    });
  });
});
