import {checkNotNull} from '../../shared/utils/Preconditions';
import AppDefinition from './AppDefinition';
import mockAppDefinition from './mockAppConfig';

export interface AppConfig {
  definition?: AppDefinition;
  applicationUrl: string;
  consoleUrl?: string;
  sourceRepositoryUrl?: string;
}

export const isMockMode = checkNotNull(process.env.REACT_APP_MODE, 'process.env.REACT_APP_MODE') === 'mock';

const appConfig: AppConfig = {
  applicationUrl: '/api'
};
declare var WELCOME_APP_CONFIG: AppDefinition | undefined;
declare var OPENSHIFT_CONSOLE_URL: string | undefined;

if (!isMockMode) {
  appConfig.definition = checkNotNull(WELCOME_APP_CONFIG, 'WELCOME_APP_CONFIG');
  const consoleUrl = OPENSHIFT_CONSOLE_URL || '';
  const repositoryUrl = process.env.REACT_APP_SOURCE_REPOSITORY_URL || '';
  appConfig.sourceRepositoryUrl = repositoryUrl.length > 0 ? repositoryUrl : undefined;
  appConfig.consoleUrl = consoleUrl.length > 0 ? consoleUrl : undefined;
} else {
  appConfig.definition = mockAppDefinition;
  appConfig.consoleUrl = 'http://consoleUrl.mock.io';
  appConfig.sourceRepositoryUrl = 'http://sourceRepositoryUrl.mock.io';
}

checkNotNull(appConfig.definition, 'appConfig.definition');

export default appConfig;
