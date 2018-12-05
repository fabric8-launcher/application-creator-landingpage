import * as React from 'react';
import CapabilityCard from '../../components/CapabilityCard';

import './RestCapability.css';
import { Grid, GridItem, TextInput } from '@patternfly/react-core';
import { RestCapabilityApi } from './RestCapabilityApi';
import capabilitiesConfig from '../../config/capabilitiesConfig';
import { PlugIcon } from '@patternfly/react-icons';
import HttpRequest from '../../../shared/components/HttpRequest';
import { SourceMappingLink } from '../../../shared/components/SourceMappingLink';
import RequestConsole, { RequestResult } from '../../../shared/components/RequestConsole';

interface RestCapabilityProps {
  apiService: RestCapabilityApi;
  sourceRepository?: {
    url: string;
    provider: string;
  };
  extra: {
    sourceMapping: {
      greetingEndpoint: string;
    };
  };
}

interface RestCapabilityState {
  consoleContent: RequestResult[];
  results: Array<{ content: string, time: number }>;
  params: {
    [name: string]: string;
  }
}

export default class RestCapability extends React.Component<RestCapabilityProps, RestCapabilityState> {

  constructor(props) {
    super(props);

    this.state = {
      results: [],
      consoleContent: [],
      params: {
        name: '',
      },
    };
  }

  public render() {
    return (
      <CapabilityCard module="rest">
        <CapabilityCard.Title><PlugIcon className="with-text" /> {capabilitiesConfig.rest.name}</CapabilityCard.Title>
        <CapabilityCard.Body>
          <Grid>
            <GridItem span={12}>
              HTTP API endpoints expose your application to outside callers.
              Through these, programs may communicate over the network in a language-independent fashion.
              We have created an initial set of endpoints to illustrate how you may accomplish this in your selected runtime,
              Vert.x. By composing together HTTP endpoints and making use of hypermedia and links,
              you may follow these patterns to construct a RESTful architecture.
            </GridItem>
            <CapabilityCard.Separator />
            <GridItem span={12} className="http-request-service">
              <SourceMappingLink sourceRepository={this.props.sourceRepository}
                name="greetingEndpoint"
                fileRepositoryLocation={this.props.extra.sourceMapping.greetingEndpoint} />
            </GridItem>
            <HttpRequest method="GET"
              path="/greetings?name="
              curlCommand={`curl -X GET '${this.getGreetingsUrl()}'`}
              onExecute={this.execGet}>
              <TextInput id="http-api-param-name-input"
                value={this.state.params.name}
                onChange={this.handleInputChange}
                name="name" placeholder="World" className="http-request-param" />
            </HttpRequest>
            <GridItem span={12}>
              <RequestConsole id="rest-content" results={this.state.consoleContent} />
            </GridItem>
          </Grid>
        </CapabilityCard.Body>
      </CapabilityCard>
    );
  }

  private execGet = async () => {
    const result = await this.props.apiService.doGetGreeting(this.state.params.name);
    this.setState({
      results: [...this.state.results, result],
    });
    this.logToConsole(result);
  };


  private handleInputChange = (_, event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      params: {
        ...this.state.params,
        [name]: value,
      }
    });
  };

  private logToConsole(result: { content: string, time: number }) {
    const url = this.getGreetingsUrl();
    this.setState({
      consoleContent: [...this.state.consoleContent, {
        method: 'GET',
        time: result.time,
        result: result.content,
        url,
      }],
    });
  }

  private getGreetingsUrl() {
    return this.props.apiService.getGreetingAbsoluteUrl(this.state.params.name);
  }
}