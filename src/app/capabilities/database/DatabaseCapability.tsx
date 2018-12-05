import * as React from 'react';
import CapabilityCard from '../../components/CapabilityCard';
import capabilitiesConfig from '../../config/capabilitiesConfig';
import {DatabaseCapabilityApi} from './DatabaseCapabilityApi';
import {Grid, GridItem, TextInput} from '@patternfly/react-core';
import {SourceMappingLink} from '../../../shared/components/SourceMappingLink';
import HttpRequest from '../../../shared/components/HttpRequest';
import {defaultIfEmpty} from '../../../shared/utils/Strings';
import {DatabaseIcon} from '@patternfly/react-icons';
import RequestConsole, {RequestResult} from '../../../shared/components/RequestConsole';


interface DatabaseCapabilityProps {
  databaseType: string;
  apiService: DatabaseCapabilityApi;
  sourceRepository?: {
    url: string;
    provider: string;
  };
  extra: {
    sourceMapping: {
      dbEndpoint: string;
    };
  };
}

interface DatabaseCapabilityState {
  consoleContent: RequestResult[];
  results: Array<{ content: any, time: number }>;
  params: {
    [name: string]: string;
  }
}

export default class DatabaseCapability extends React.Component<DatabaseCapabilityProps, DatabaseCapabilityState> {

  constructor(props) {
    super(props);

    this.state = {
      results: [],
      consoleContent: [],
      params: {
        postName: '',
        postStock: '',
        putId: '',
        putName: '',
        putStock: '',
        deleteId: '',
      },
    };
  }

  public render() {
    return (
      <CapabilityCard module="database">
        <CapabilityCard.Title><DatabaseIcon className="with-text"/> {capabilitiesConfig.database.name}</CapabilityCard.Title>
        <CapabilityCard.Body>
          <Grid>
            <GridItem span={12}>
              As a starting point for your development,
              we have created a table and populated it with some data.
              We've additionally exposed CRUD operations via the following endpoints to give you a system that works end to end.
            </GridItem>
            <CapabilityCard.Separator/>
            <GridItem span={12} className="http-request-service">
              <SourceMappingLink sourceRepository={this.props.sourceRepository}
                                 name="dbEndpoint"
                                 fileRepositoryLocation={this.props.extra.sourceMapping.dbEndpoint}/>
            </GridItem>
            <HttpRequest method="GET"
                         path="/fruits"
                         curlCommand={`curl -X GET '${this.props.apiService.getFruitsAbsoluteUrl()}'`}
                         onExecute={this.execFetchFruits}
            />
            <HttpRequest method="POST"
                         path="/fruits"
                         curlCommand={this.getPostFruitCurlCommand()}
                         onExecute={this.execPostFruit}
            >
              <span style={{marginLeft: '98px'}}>
                Name: <TextInput id="http-api-param-post-name-input"
                                 value={this.state.params.postName}
                                 onChange={this.handleInputChange}
                                 name="postName"
                                 placeholder="Coco"
                                 className="http-request-param"/>
              </span>
              <span style={{marginLeft: '50px'}}>
                Stock: <TextInput id="http-api-param-post-stock-input"
                                 value={this.state.params.postStock}
                                 onChange={this.handleInputChange}
                                 name="postStock"
                                 placeholder="10"
                                 className="http-request-param"/>
              </span>
            </HttpRequest>
            <HttpRequest method="PUT"
                         path="/fruits/"
                         curlCommand={this.getPutFruitCurlCommand()}
                         onExecute={this.execPutFruit}
            >
              <TextInput id="http-api-param-put-id-input"
                         value={this.state.params.putId}
                         onChange={this.handleInputChange}
                         name="putId"
                         placeholder="2"
                         className="http-request-param"
                         style={{width:'40px'}}
              />
              <span style={{marginLeft: '50px'}}>
                Name: <TextInput id="http-api-param-put-name-input"
                                 value={this.state.params.putName}
                                 onChange={this.handleInputChange}
                                 name="putName"
                                 placeholder="Banana"
                                 className="http-request-param"/>
              </span>
              <span style={{marginLeft: '50px'}}>
                Stock: <TextInput id="http-api-param-put-stock-input"
                                  value={this.state.params.putStock}
                                  onChange={this.handleInputChange}
                                  name="putStock"
                                  placeholder="10"
                                  className="http-request-param"/>
              </span>
            </HttpRequest>
            <HttpRequest method="DELETE"
                         path="/fruits/"
                         curlCommand={this.getDeleteFruitCurlCommand()}
                         onExecute={this.execDeleteFruit}
            >
              <TextInput id="http-api-param-delete-id-input"
                         value={this.state.params.deleteId}
                         onChange={this.handleInputChange}
                         name="deleteId"
                         placeholder="2"
                         className="http-request-param"
                         style={{width:'40px'}}
              />
            </HttpRequest>
            <GridItem span={12}>
              <RequestConsole id="database-content" results={this.state.consoleContent}/>
            </GridItem>
            <CapabilityCard.Separator/>
          </Grid>
        </CapabilityCard.Body>
      </CapabilityCard>
    );
  }

  private execFetchFruits = async () => {
    const result = await this.props.apiService.doFetchFruits();
    this.setState({
      results: [...this.state.results, result],
    });
    this.logToConsole('GET', result);
  };

  private getPostFruitData() {
    return {
      name: defaultIfEmpty(this.state.params.postName, 'Coco'),
      stock: Number(defaultIfEmpty(this.state.params.postStock, '10')),
    };
  }

  private getPostFruitCurlCommand() {
    return `curl -X POST '${this.props.apiService.getFruitsAbsoluteUrl()}' `
      + `--header 'Content-Type: application/json' `
      + `--data '${JSON.stringify(this.getPostFruitData())}'`;
  }

  private execPostFruit = async () => {
    const result = await this.props.apiService.doPostFruit(this.getPostFruitData());
    this.setState({
      results: [...this.state.results, result],
    });
    this.logToConsole('POST', result);
  };

  private getPutFruitId() {
    return Number(defaultIfEmpty(this.state.params.putId, '2'));
  }

  private getPutFruitData() {
    return {
      name: defaultIfEmpty(this.state.params.putName, 'Banana'),
      stock: Number(defaultIfEmpty(this.state.params.putStock, '10')),
    };
  }

  private getPutFruitCurlCommand() {
    return `curl -X PUT '${this.props.apiService.getFruitsAbsoluteUrl()}/${this.getPutFruitId()}' `
      + `--header 'Content-Type: application/json' `
      + `--data '${JSON.stringify(this.getPutFruitData())}'`;
  }

  private execPutFruit = async () => {
    const result = await this.props.apiService.doPutFruit(this.getPutFruitId(), this.getPutFruitData());
    this.setState({
      results: [...this.state.results, result],
    });
    this.logToConsole('PUT', result);
  };

  private getDeleteFruitId() {
    return Number(defaultIfEmpty(this.state.params.deleteId, '2'));
  }


  private getDeleteFruitCurlCommand() {
    return `curl -X DELETE '${this.props.apiService.getFruitsAbsoluteUrl()}/${this.getDeleteFruitId()}' `;
  }

  private execDeleteFruit = async () => {
    const result = await this.props.apiService.doDeleteFruit(this.getDeleteFruitId());
    const newResult = { ...result, content: 'true'};
      this.setState({
        results: [...this.state.results, newResult ],
      });
      this.logToConsole('DELETE', newResult);
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

  private logToConsole(type: string, result: { content: any, time: number }) {
    const url = this.props.apiService.getFruitsAbsoluteUrl();
    this.setState({
      consoleContent: [ ...this.state.consoleContent, {
        method: type,
        time: result.time,
        result: result.content,
        url,
      }],
    });
  }

}