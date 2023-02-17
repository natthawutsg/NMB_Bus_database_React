import React from 'react';
import { shallow } from 'enzyme';
import Master_vender from './master_vender';

describe('Master_vender', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Master_vender />);
    expect(wrapper).toMatchSnapshot();
  });
});
