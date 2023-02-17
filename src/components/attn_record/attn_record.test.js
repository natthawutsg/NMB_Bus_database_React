import React from 'react';
import { shallow } from 'enzyme';
import Attn_record from './attn_record';

describe('Attn_record', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Attn_record />);
    expect(wrapper).toMatchSnapshot();
  });
});
