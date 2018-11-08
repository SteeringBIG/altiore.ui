import { AxiosResponse } from 'axios';
import { handleActions } from 'redux-actions';

import { fetchPublicProject } from './actions';
import { PublicProject } from './PublicProject';

type S = PublicProject;
type P = AxiosResponse;

const fetchPublicProjectHandler = () => {
  return new PublicProject({
    isLoading: true,
  });
};

const fetchPublicProjectSuccessHandler = (state: S, { payload }: any) => {
  return new PublicProject({ ...payload.data, isLoaded: true, isLoading: false });
};

const fetchPublicProjectFailHandler = () => {
  return new PublicProject({ isLoaded: false, isLoading: false });
};

export const publicProject = handleActions<S, P>(
  {
    [fetchPublicProject.toString()]: fetchPublicProjectHandler,
    [fetchPublicProject.success]: fetchPublicProjectSuccessHandler,
    [fetchPublicProject.fail]: fetchPublicProjectFailHandler,
  },
  new PublicProject()
);