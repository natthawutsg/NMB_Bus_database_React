import React from 'react';
import { shallow } from 'enzyme';
import Emplogin from './emplogin';

describe('Emplogin', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Emplogin />);
    expect(wrapper).toMatchSnapshot();
  });
});
