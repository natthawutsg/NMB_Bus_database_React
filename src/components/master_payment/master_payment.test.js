import React from 'react';
import { shallow } from 'enzyme';
import Master_payment from './master_payment';

describe('Master_payment', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Master_payment />);
    expect(wrapper).toMatchSnapshot();
  });
});
