import React from 'react';
import { shallow } from 'enzyme';
import Opd_input from './opd_input';

describe('Opd_input', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Opd_input />);
    expect(wrapper).toMatchSnapshot();
  });
});
