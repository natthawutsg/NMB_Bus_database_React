import React from 'react';
import { shallow } from 'enzyme';
import Bus_db from './bus_db';

describe('Bus_db', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Bus_db />);
    expect(wrapper).toMatchSnapshot();
  });
});
