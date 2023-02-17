import React from 'react';
import { shallow } from 'enzyme';
import Edituser from './edituser';

describe('Edituser', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Edituser />);
    expect(wrapper).toMatchSnapshot();
  });
});
