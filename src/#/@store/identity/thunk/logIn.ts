import { push } from 'connected-react-router';
import get from 'lodash/get';
import { Dispatch } from 'redux';
import { clearAsyncError } from 'redux-form';

import { showError, showSuccess, showWarning } from '#/@store/notifications';

import { logInPatch } from '../actions';
import { loadInitialData } from './loadInitialData';

import { INotification } from '@types';
import getMailClientLinkByEmail from '@utils/getMailClientLinkByEmail';
import openUrlInNewTab from '@utils/openUrlInNewTab';

export const logIn = async (data: { email: string; password: string }, dispatch: Dispatch<any>, { isLogin }) => {
  try {
    await dispatch(logInPatch(data));
    dispatch(push('/'));
    await dispatch(loadInitialData() as any);
    if ((window as any).PasswordCredential && 'navigator' in window) {
      const cred = new (window as any).PasswordCredential({
        id: data.email,
        name: data.email,
        password: data.password,
      });
      await (navigator as any).credentials.store(cred);
    }
  } catch (e) {
    const statusError = get(e, 'error.response.status');

    if (statusError === 422) {
      if (isLogin) {
        const message = get(e, ['error', 'response', 'data', 'message'], 'Ошибка логина или пароля');
        const messageObj: INotification = {
          message,
          title: 'Что-то пошло не так',
        };
        const email = get(e, ['meta', 'previousAction', 'payload', 'request', 'data', 'email']);
        const url = email && getMailClientLinkByEmail(email);
        if (url) {
          messageObj.action = {
            callback: () => openUrlInNewTab(url),
            label: 'Перейти в почту',
          };
        }
        dispatch(showWarning(messageObj));
      } else {
        const messageObj: INotification = {
          message: 'Проверьте почту, чтоб продолжить регистрицию',
          title: 'Пользователь был успешно создан',
        };
        const email = get(e, ['meta', 'previousAction', 'payload', 'request', 'data', 'email']);
        const url = email && getMailClientLinkByEmail(email);
        if (url) {
          messageObj.action = {
            callback: () => openUrlInNewTab(url),
            label: 'Перейти в почту',
          };
        }
        dispatch(showSuccess(messageObj));
        const formName = get(e, ['meta', 'previousAction', 'payload', 'form']);
        if (formName) {
          dispatch(clearAsyncError(formName, 'email'));
        }
      }

      return;
    }

    dispatch(showError({ message: e.toString() }));
  }
};
