import React from 'react';
import { shallow } from 'enzyme';
import Master_route from './master_route';

describe('Master_route', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Master_route />);
    expect(wrapper).toMatchSnapshot();
  });
});
