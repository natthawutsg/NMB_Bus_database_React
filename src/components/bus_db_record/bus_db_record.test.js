import React from 'react';
import { shallow } from 'enzyme';
import Bus_db_record from './bus_db_record';

describe('Bus_db_record', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Bus_db_record />);
    expect(wrapper).toMatchSnapshot();
  });
});
