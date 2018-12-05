import {checkNotNull} from '../../shared/utils/Preconditions';
import AppDefinition from './AppDefinition';
import mockAppDefinition from './mockAppConfig';
import { undefinedIfEmpty } from '../../shared/utils/Strings';

export interface AppConfig {
  definition?: AppDefinition;
  applicationUrl: string;
  openshiftConsoleUrl?: string;
  sourceRepositoryUrl?: string;
  sourceRepositoryProvider?: string;
}

export const isMockMode = checkNotNull(process.env.REACT_APP_MODE, 'process.env.REACT_APP_MODE') === 'mock';

const appConfig: AppConfig = {
  applicationUrl: '/api'
};

interface InjectedAppConfig {
  openshiftConsoleUrl: string;
  encodedDefinition: string;
  sourceRepositoryUrl: string; 
  sourceRepositoryProvider: string;
}

declare var INJECTED_APP_CONFIG: InjectedAppConfig | undefined;

if (!isMockMode) {
  checkNotNull(INJECTED_APP_CONFIG, 'INJECTED_APP_CONFIG');
  try {
    appConfig.definition = JSON.parse(INJECTED_APP_CONFIG!.encodedDefinition);
  } catch(e) {
    throw new Error('Error while parsing WelcomeApp config: ' + e.toString());
  }
  
  appConfig.sourceRepositoryUrl = undefinedIfEmpty(INJECTED_APP_CONFIG!.openshiftConsoleUrl);
  appConfig.openshiftConsoleUrl = undefinedIfEmpty(INJECTED_APP_CONFIG!.sourceRepositoryUrl);
  appConfig.sourceRepositoryProvider = undefinedIfEmpty(INJECTED_APP_CONFIG!.sourceRepositoryProvider);
} else {
  appConfig.definition = mockAppDefinition;
  appConfig.openshiftConsoleUrl = 'http://consoleUrl.mock.io';
  appConfig.sourceRepositoryUrl = 'http://sourceRepositoryUrl.mock.io';
}

checkNotNull(appConfig.definition, 'appConfig.definition');

export default appConfig;
