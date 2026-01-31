import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ordersThunk, selectorOrders } from '../../services/order/Slice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectorOrders);

  useEffect(() => {
    dispatch(ordersThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
