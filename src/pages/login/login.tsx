import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginThunk,
  selectorIsAuth,
  selectorUserError
} from '../../services/user/Slice';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isAuth = useSelector(selectorIsAuth);
  const location = useLocation() as { state?: { from?: string } };
  const navigate = useNavigate();
  const error = useSelector(selectorUserError);

  if (isAuth) {
    return <Navigate to={'/'} />;
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginThunk({ email, password }))
      .unwrap()
      .then(() => {
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      })
      .catch(() => {});
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
