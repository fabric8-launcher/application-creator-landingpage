import * as React from 'react';
import {ExternalLink} from './ExternalLink';
import {AngleDoubleRightIcon} from '@patternfly/react-icons';


export function SourceMappingLink(props: {
  sourceRepository?: {
    url: string;
    provider: string;
  };
  name: string;
  fileRepositoryLocation: string;
}) {
  if (props.sourceRepository && props.sourceRepository.provider === 'GitHub') {
    const link = `${props.sourceRepository.url.replace('.git', '')}/blob/master/${props.fileRepositoryLocation}`;
    return (<div><AngleDoubleRightIcon className="with-text" /> {props.name} (<ExternalLink href={link}>view source</ExternalLink>)</div>)
  }
  return (<div title={props.fileRepositoryLocation}><AngleDoubleRightIcon className="with-text" /> {props.name}</div>);
}