/// <reference types="cypress" />

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // перехват запроса на эндпоинт 'api/ingredients’
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  // Протестировано добавление ингредиента из списка в конструктор
  describe('Добавление ингредиентов в конструктор', () => {
    it('Должен добавить булку в конструктор', () => {
      cy.addIngredient('Краторная булка N-200i');

      cy.get('[data-cy="burger-constructor"]').as('constructor');
      cy.get('@constructor').should('contain', 'Краторная булка N-200i (верх)');
      cy.get('@constructor').should('contain', 'Краторная булка N-200i (низ)');
    });

    it('Должен добавить основной ингредиент в конструктор', () => {
      cy.addIngredient('Биокотлета из марсианской Магнолии');

      cy.get('[data-cy="burger-constructor"]').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
    });

    it('Должен добавить соус в конструктор', () => {
      cy.addIngredient('Соус Spicy-X');

      cy.get('[data-cy="burger-constructor"]').should(
        'contain',
        'Соус Spicy-X'
      );
    });
  });

  // Протестирована работа модальных окон
  describe('Модальное окно игредиента', () => {
    it('Должен открыть модальное окно при клике на ингредиент', () => {
      // открытие модального окна ингредиента
      cy.contains('Краторная булка N-200i').click();

      cy.get('[data-cy="modal"]').as('modal');
      cy.get('@modal').should('be.visible');
      cy.get('@modal').should('contain', 'Краторная булка N-200i');
      cy.get('@modal').should('contain', 'Калории, ккал');
      cy.get('@modal').should('contain', '420');
    });

    it('Должен показать правильный игредиент в модальном окне', () => {
      cy.contains('Биокотлета из марсианской Магнолии').click();

      cy.get('[data-cy="modal"]').as('modal');
      cy.get('@modal').should('contain', 'Биокотлета из марсианской Магнолии');
      cy.get('@modal').should('contain', '4242');
      cy.get('@modal').should('contain', '420');
      cy.get('@modal').should('contain', '142');
      cy.get('@modal').should('contain', '242');
    });

    // закрытие по клику на крестик
    it('Должен закрыть модальное окно при клике на крестик', () => {
      cy.contains('Краторная булка N-200i').click();

      cy.get('[data-cy="modal"]').as('modal');
      cy.get('@modal').should('be.visible');
      cy.get('@modal').find('button').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    // закрытие по клику на оверлей
    it('Должен закрыть модальное окно при клике на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();

      cy.get('[data-cy="modal"]').as('modal');
      cy.get('@modal').should('be.visible');
      cy.get('[data-cy="modal-overlay"]').click({ force: true });
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  // Создание заказа
  describe('Создание заказа', () => {
    beforeEach(() => {
      // Подставляются моковые токены авторизации.
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'testRefreshToken123');
      });
      cy.setCookie('accessToken', 'testAccessToken123');

      cy.intercept('GET', '**/api/ingredients', {
        fixture: 'ingredients.json'
      }).as('getIngredients');

      cy.intercept('GET', '**/api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');

      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
      cy.clearCookie('accessToken');
    });

    // Собирается бургер
    it('Должен успешно создать заказ', () => {
      cy.addIngredient('Краторная булка N-200i');
      cy.addIngredient('Биокотлета из марсианской Магнолии');
      cy.addIngredient('Соус Spicy-X');

      // Вызывается клик по кнопке «Оформить заказ»
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');

      // Проверяется, что модальное окно открылось и номер заказа верный.
      cy.get('[data-cy="modal"]').as('modal');
      cy.get('@modal').should('be.visible');
      cy.get('@modal').should('contain', '12345');
      cy.get('@modal').should('contain', 'идентификатор заказа');

      // Закрывается модальное окно и проверяется успешность закрытия.
      cy.get('@modal').find('button').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      // Проверяется, что конструктор пуст.
      cy.get('[data-cy="burger-constructor"]').as('constructor');
      cy.get('@constructor').should('contain', 'Выберите булки');
      cy.get('@constructor').should('contain', 'Выберите начинку');
    });
  });
});
