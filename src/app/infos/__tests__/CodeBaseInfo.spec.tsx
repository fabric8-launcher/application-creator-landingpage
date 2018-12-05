import * as React from 'react';
import {shallow} from 'enzyme';
import { CodeBaseInfo } from '../CodeBaseInfo';

const runtime = {
  name: 'Vert.x',
  description: `A
  tool-kit for building reactive applications on the
  JVM.`,
  icon: 'icon',
  metadata: {
    language: 'java',
  },
};

const sourceRepository = {
  url: 'https://github.com/fabric8-launcher/launcher-creator-welcome-app.git',
  provider: 'GitHub',
};

describe('<CodeBaseInfo />', () => {
  it('check that render is correct', () => {
    const component = shallow(<CodeBaseInfo baseImage="group/imagename" runtime={runtime} />);
    expect(component).toMatchSnapshot();
  });

  it('check that render is correct with repositoryUrl', () => {
    const component = shallow(<CodeBaseInfo baseImage="group/imagename" runtime={runtime} sourceRepository={sourceRepository} />);
    expect(component).toMatchSnapshot();
  });

});

