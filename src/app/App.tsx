import {
  Brand, Button, ButtonVariant, Nav, NavItem, NavList, Page,
  PageHeader, PageSection, PageSectionVariants, PageSidebar, Text, TextContent, Toolbar, ToolbarGroup, ToolbarItem
} from '@patternfly/react-core';
import { CogIcon, CloudIcon, CodeIcon, ServicesIcon, ScreenIcon } from '@patternfly/react-icons';
import { global_breakpoint_md as breakpointMd } from '@patternfly/react-tokens';
import * as _ from 'lodash';
import * as React from 'react';
import logo from '../assets/logo/RHD-logo.svg';
import { getLocationAbsoluteUrl } from '../shared/utils/Locations';
import { checkNotNull } from '../shared/utils/Preconditions';
import './App.css';
import capabilitiesCardsMapping from './capabilities/capabilitiesCardsMapping';
import appConfig from './config/appConfig';
import { BackendTier, FrontendTier } from './config/AppDefinition';
import capabilitiesConfig from './config/capabilitiesConfig';
import { BackendTierInfo } from './infos/BackendTierInfo';
import { CloudDeploymentInfo } from './infos/CloudDeploymentInfo';
import { CodeBaseInfo } from './infos/CodeBaseInfo';
import { FrontendTierInfo } from './infos/FrontendTierInfo';



const appDefinition = checkNotNull(appConfig.definition, 'appConfig.definition');
const backendTier = (appDefinition.tiers.length === 1 ?
    appDefinition.tiers[0] :
    appDefinition.tiers.find(t => t.tier === 'backend')) as BackendTier;
const frontendTier = appDefinition.tiers.find(t => t.tier === 'frontend') as FrontendTier;
const capabilities = [...(backendTier ? backendTier.capabilities : [])];
const capabilityDefinitionByModule = _.keyBy(capabilities, 'module');

export default class App extends React.Component<{}, { isNavOpen: boolean }> {

  constructor(props) {
    super(props);
    const isNavOpen = typeof window !== 'undefined' && window.innerWidth >= parseInt(breakpointMd.value, 10);
    this.state = {
      isNavOpen,
    }
  }

  public render() {

    const PageNav = (
      <Nav onSelect={this.onNavSelect} onToggle={this.onNavToggle} aria-label="Nav">
        <NavList>
          <NavItem to={`#cloud-deployment-info`}>
            <CloudIcon className="with-text" /> Cloud Deployment
          </NavItem>
          {appConfig.sourceRepository && (
            <NavItem to={`#codebase-info`}>
              <CodeIcon className="with-text" /> Codebase
            </NavItem>
          )}
          {frontendTier && (
            <NavItem to={`#frontend-tier-info`}>
              <ScreenIcon className="with-text" /> Frontend
            </NavItem>
          )}
          {backendTier && (
            <NavItem to={`#backend-tier-info`}>
              <ServicesIcon className="with-text" /> Backend
            </NavItem>
          )}
          {_.values(capabilitiesConfig).filter(this.showCapability).map(c => (
            <NavItem key={c.module} to={`#${c.module}-capability`}>
              {c.icon} {c.name}
            </NavItem>
          ))}
        </NavList>
      </Nav>
    );
    const PageToolbar = (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem>
            <Button id="nav-toggle" aria-label="Overflow actions" variant={ButtonVariant.plain}>
              <CogIcon />
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    );

    const Header = (
      <PageHeader
        logo={<Brand src={logo} alt="Red Hat" />}
        toolbar={PageToolbar}
        showNavToggle
        onNavToggle={this.onNavToggle}
      />
    );

    const Sidebar = <PageSidebar nav={PageNav} isNavOpen={this.state.isNavOpen} />;

    return (
      <React.Fragment>
        <Page header={Header} sidebar={Sidebar}>
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">Here we go.</Text>
              <Text component="p">
                Congratulations; we've together built a working system of application code and services running on the OpenShift platform.
                Everything is hooked together for you to bring your ideas to life.
              </Text>
            </TextContent>
          </PageSection>
          <PageSection>
            <CloudDeploymentInfo
              application={appDefinition.application}
              applicationUrl={getLocationAbsoluteUrl('')}
              openshiftConsoleUrl={appConfig.openshiftConsoleUrl!} />
            {appConfig.sourceRepository && (
              <CodeBaseInfo sourceRepository={appConfig.sourceRepository} />
            )}
            {frontendTier && (
              <FrontendTierInfo {...frontendTier.extra} />
            )}
            {backendTier && (
              <BackendTierInfo {...backendTier.extra} />
            )}
            {_.values(capabilitiesConfig).filter(this.showCapability).map(c => {
              const CapabilityComponent = capabilitiesCardsMapping[c.module];
              const capabilityDefinition = capabilityDefinitionByModule[c.module];
              const props = capabilityDefinition ? { ...capabilityDefinition.props, extra: capabilityDefinition.extra } : {};
              return (
                <CapabilityComponent {...props} key={c.module} />
              );
            })}
          </PageSection>
        </Page>
      </React.Fragment>
    );
  }

  private showCapability = (capability: { module: string, requireDefinition: boolean }) => {
    return !capability.requireDefinition || !!capabilityDefinitionByModule[capability.module];
  };

  private onNavSelect = result => {
  };

  private onNavToggle = () => {
    this.setState({
      isNavOpen: !this.state.isNavOpen
    });
  };
}