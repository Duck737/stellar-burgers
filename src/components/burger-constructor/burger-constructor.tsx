import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  burgerThunk,
  clearOrderModalData,
  selectorConstructorData,
  selectorOrderModalData,
  selectorOrderRequest,
  setRequest
} from '../../services/burgerConstructor/Slice';
import { useNavigate } from 'react-router-dom';
import { selectorIsAuth } from '../../services/user/Slice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectorConstructorData) || {
    bun: null,
    ingredients: []
  };

  const isAuth = useSelector(selectorIsAuth);

  const orderRequest = useSelector(selectorOrderRequest);

  const orderModalData = useSelector(selectorOrderModalData);

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;
    const order = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      ),
      constructorItems.bun._id
    ].filter(Boolean);
    dispatch(burgerThunk(order));
  };
  const closeOrderModal = () => {
    dispatch(setRequest(false));
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
