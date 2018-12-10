import {checkNotNull} from '../../shared/utils/Preconditions';
import mockAppDefinition from './mockAppConfig';
import { undefinedIfEmpty } from '../../shared/utils/Strings';
import { AppDefinition } from './AppDefinition';
import { getLocationAbsoluteUrl } from '../../shared/utils/Locations';

export interface AppConfig {
  definition?: AppDefinition;
  backendUrl: string;
  openshiftConsoleUrl?: string;
  sourceRepository?: {
    url: string;
    provider: string;
  };
}

export const isMockMode = checkNotNull(process.env.REACT_APP_MODE, 'process.env.REACT_APP_MODE') === 'mock';

export function getRouteLink(routeName) {
  return getLocationAbsoluteUrl().replace('welcome-', routeName + '-');
}

const appConfig: AppConfig = {
  backendUrl: '/backend'
};

interface InjectedConfig {
  openshiftConsoleUrl: string;
  encodedDefinition: string;
  sourceRepositoryUrl: string; 
  sourceRepositoryProvider: string;
}

declare var INJECTED_CONFIG: InjectedConfig | undefined;

if (!isMockMode) {
  checkNotNull(INJECTED_CONFIG, 'INJECTED_CONFIG');
  try {
    appConfig.definition = JSON.parse(INJECTED_CONFIG!.encodedDefinition);
  } catch(e) {
    throw new Error('Error while parsing WelcomeApp config: ' + e.toString());
  }
  
  appConfig.openshiftConsoleUrl = undefinedIfEmpty(INJECTED_CONFIG!.openshiftConsoleUrl);
  const sourceRepositoryUrl = undefinedIfEmpty(INJECTED_CONFIG!.sourceRepositoryUrl);
  if(sourceRepositoryUrl) {
    appConfig.sourceRepository = {
      url: sourceRepositoryUrl,
      provider: undefinedIfEmpty(INJECTED_CONFIG!.sourceRepositoryProvider)!,
    };
  }
} else {
  appConfig.definition = mockAppDefinition;
  appConfig.openshiftConsoleUrl = 'http://consoleUrl.mock.io';
  appConfig.sourceRepository = {
    url: 'https://github.com/fabric8-launcher/launcher-creator-welcome-app.git',
    provider: 'GitHub',
  };
}

checkNotNull(appConfig.definition, 'appConfig.definition');

export default appConfig;
