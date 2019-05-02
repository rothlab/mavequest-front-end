import { shallowMount, createLocalVue } from '@vue/test-utils';
import Buefy from 'buefy';
import UnderConstructionView from '@/components/UnderConstructionView';

const localVue = createLocalVue();
localVue.use(Buefy);

describe('UnderConstructionView.vue', () => {
  const wrapper = shallowMount(UnderConstructionView, {
    localVue
  });

  it('should render text properly', () => {
    const msg = 'Working on it...';
    expect(wrapper.find('.subtitle').text()).toMatch(msg);
  })

  it('should display five icons with proper size and location', () => {
    const num_icons = 5;
    const icons = wrapper.findAll('.icon-space');

    expect(icons.length).toBe(num_icons);
  })
})
