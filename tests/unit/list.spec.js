import { mount } from "@vue/test-utils";
import List from "@/components/List.vue";

describe('List.vue', () => {
  it('Renderiza interface', () => {
    const wrapper = mount(List, {
      props: {
        selectedDate: new Date()
      },
      global: {
        mocks: {
          $store: {
            getters: {
              allHabits: [],
              isHabitChecked: () => false
            },
            dispatch: jest.fn()
          }
        }
      }
    })

    const titleListHabits = wrapper.find('[data-test="list_title"]');
    expect(titleListHabits.exists()).toBe(true);
    expect(titleListHabits.text()).toBe('Your habits');
  })
})