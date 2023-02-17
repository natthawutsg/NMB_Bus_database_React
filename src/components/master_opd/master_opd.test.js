import React from 'react';
import { shallow } from 'enzyme';
import Master_opd from './master_opd';

describe('Master_opd', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Master_opd />);
    expect(wrapper).toMatchSnapshot();
  });
});
