import * as React from 'react';
import Capability from '../Capability';
import capabilitiesConfig from 'app/config/capabilitiesConfig';
import { LocalForm, Control } from 'react-redux-form';
import ShellCommand from 'app/landing/components/shared/ShellCommandComponent';
import { HttpApi } from 'shared/utils/HttpApi';
import appConfig, {isMockMode} from '../../config/appConfig';
import appHttpApi from '../../appHttpApi';
import RestCapabilityApi from './RestCapabilityApi';
import { formatCurrentTime } from 'app/landing/components/shared/Utilities';

class HttpRestCapabilityApi implements RestCapabilityApi {
  private httpApi: HttpApi = appHttpApi;

  public get(name: string): Promise<string> {
    return this.httpApi.get('/greetings/' + name);
  }
}

class MockRestCapabilityApi implements RestCapabilityApi {
  public get(name: string): Promise<string> {
    return Promise.resolve('Hello ' + (name || 'World') + '!');
  }
}

interface RestCapabilityProps {
}

interface RestCapabilityState {
  consoleContent: string;
}

export default class RestCapability extends React.Component<RestCapabilityProps, RestCapabilityState> {
  private readonly httpService = isMockMode ? new MockRestCapabilityApi() : new HttpRestCapabilityApi();

  constructor(props) {
    super(props);

    this.state = {
      consoleContent: ''
    };
  }

  public execGet = (values) => {
    this.httpService.get(values.name).then(value => {
      this.logToConsole(value);
    });
  }

  public render() {
    return (
      <Capability module="rest">
        <Capability.Title>{capabilitiesConfig.rest.name}</Capability.Title>
        <Capability.Body>
          <div className="row">
            <div className="col-sm-3">
              <samp>
                {(appConfig.definition != null ? appConfig.definition.applicationUrl : '')}
              </samp>
            </div>
            <LocalForm onSubmit={this.execGet}>
              <div className="col-sm-9">
                <div className="input-group input-group-lg">
                  <div className="input-group-btn">
                    <Control.button
                      model=".getButton"
                      className="btn btn-info"
                      type="submit"
                      data-toggle="tooltip"
                      title="Execute GET Request"
                    >GET</Control.button>
                  </div>
                  <span className="input-group-addon" id={'httpEndpointGetInput-addon'}>
                    Hello,
                  </span>
                  <Control.text model=".name" className="form-control" placeholder="World"/>
                </div>
                <Control.textarea model=".console" className="console" rows={5} disabled={true} value={this.state.consoleContent} />
                <ShellCommand
                  command={'curl ' + (appConfig.definition != null ? appConfig.definition.applicationUrl : '')}>
                  You may test this directly by making an <samp>HTTP GET</samp> request using this
                  application's URL as root. For instance, try with the <samp>cURL</samp> tool:
              </ShellCommand>
              </div>
            </LocalForm>
          </div>
        </Capability.Body>
      </Capability>
    );
  }

  private logToConsole(response: string) {
    this.setState({
      consoleContent: `${formatCurrentTime()}: ${response}\r\n ${this.state.consoleContent}`
    });
  }

}
