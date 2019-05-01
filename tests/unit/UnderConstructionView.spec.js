import { shallowMount, createLocalVue } from '@vue/test-utils';
import Buefy from 'buefy';
import UnderConstructionView from '@/components/UnderConstructionView';

const localVue = createLocalVue();
localVue.use(Buefy);

describe('UnderConstructionView.vue', () => {
  it('renders text properly', () => {
    const msg = 'Working on it...';
    const wrapper = shallowMount(UnderConstructionView, {
      localVue
    });

    expect(wrapper.find('.subtitle').text()).toMatch(msg);
  })
})
