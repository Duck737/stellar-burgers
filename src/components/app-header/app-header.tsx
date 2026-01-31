import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectorUserData } from '../../services/user/Slice';

export const AppHeader: FC = () => {
  const user = useSelector(selectorUserData)?.name;
  return <AppHeaderUI userName={user} />;
};
