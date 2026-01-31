import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from './store';
import { selectorIsAuthChecked, selectorUserData } from './user/Slice';
import { Preloader } from '@ui';

interface IProtectedRoute {
  onlyAuth?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute = ({
  onlyAuth = false,
  children
}: IProtectedRoute) => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectorIsAuthChecked);
  const user = useSelector(selectorUserData);
  const isAuth = Boolean(user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  if (onlyAuth && isAuth) {
    const redirect = location.state?.from || { pathname: '/' };
    return <Navigate to={redirect} replace />;
  }

  return children;
};
