import {Grid, GridItem} from '@patternfly/react-core';
import * as React from 'react';
import {ExternalLink} from '../../shared/components/ExternalLink';
import InfoCard from '../components/InfoCard';
import {CodeIcon} from '@patternfly/react-icons';
import ShellCommand from '../../shared/components/ShellCommand';

interface CodeBaseInfoProps {
  runtime: {
    name: string;
    description: string;
    icon: string;
    metadata: {
      language: string;
    }
  };
  baseImage: string;
  repositoryUrl?: string;
}

export function CodeBaseInfo(props: CodeBaseInfoProps) {
  return (
    <InfoCard name="codebase">
      <InfoCard.Title><CodeIcon className="with-text"/> {props.runtime.name} - {props.runtime.metadata.language} - Codebase</InfoCard.Title>
      <InfoCard.Body>
        <Grid>
          <GridItem span={3}>
            <img src={props.runtime.icon}/>
          </GridItem>
          <GridItem span={9}>
            <h1>{props.runtime.name} - {props.runtime.metadata.language}</h1>
            <p>Your codebase has been customized to hook into the services selected during generation.
              All capabilities are functional end-to-end for you to explore.</p>
          </GridItem>
          <InfoCard.Separator/>

          {props.repositoryUrl && (
            <React.Fragment>
              <GridItem span={3}>Git URL</GridItem>
              <GridItem span={9}>
                <ExternalLink href={props.repositoryUrl}>{props.repositoryUrl}</ExternalLink>
                <br/>
                You may use the git command-line client (or other preferred tooling) to clone this repository locally.
                <ShellCommand command={`git clone ${props.repositoryUrl}`}/>
              </GridItem>
              <InfoCard.Separator/>
            </React.Fragment>
          )}

          <GridItem span={3}>Base Image</GridItem><GridItem span={9}>{props.baseImage}</GridItem>
        </Grid>
      </InfoCard.Body>
    </InfoCard>
  );
}