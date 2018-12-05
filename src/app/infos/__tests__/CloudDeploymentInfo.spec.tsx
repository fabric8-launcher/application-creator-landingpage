import * as React from 'react';
import {shallow} from 'enzyme';
import { CloudDeploymentInfo } from '../CloudDeploymentInfo';

describe('<CloudDeploymentInfo />', () => {
  it('check that render is correct', () => {
    const component = shallow(<CloudDeploymentInfo applicationUrl="http://www.application-url.com" />);
    expect(component).toMatchSnapshot();
  });

  it('check that render is correct with repositoryUrl', () => {
    const component = shallow(<CloudDeploymentInfo applicationUrl="http://www.application-url.com" openshiftConsoleUrl="http://www.console-url.com"/>);
    expect(component).toMatchSnapshot();
  });

});

