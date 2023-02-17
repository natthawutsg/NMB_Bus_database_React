import React from 'react';
import { shallow } from 'enzyme';
import Registrule from './registrule';

describe('Registrule', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Registrule />);
    expect(wrapper).toMatchSnapshot();
  });
});
