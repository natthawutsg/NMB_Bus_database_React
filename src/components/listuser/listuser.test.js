import React from 'react';
import { shallow } from 'enzyme';
import Listuser from './listuser';

describe('Listuser', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Listuser />);
    expect(wrapper).toMatchSnapshot();
  });
});
