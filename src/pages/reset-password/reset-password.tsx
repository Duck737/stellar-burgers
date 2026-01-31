import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const { token: tokenFromUrl } = useParams<{ token?: string }>();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(tokenFromUrl || '');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (tokenFromUrl) {
      const cleanToken = tokenFromUrl.trim().replace(/\.+$/, '');
      setToken(cleanToken);
    }
  }, [tokenFromUrl]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login', { replace: true });
      })
      .catch((err) => setError(err));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword') && !tokenFromUrl) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate, tokenFromUrl]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
