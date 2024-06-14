// store/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const AssistantSlice = createSlice({
  name: 'assistant',
  initialState: {
    isOpen: false,
    componentName: '',
    modalText: '',
    audio:'',
    navigateTo:''

  },
  reducers: {
    openAssistan: (state, action) => {
      state.isOpen = true;
      state.componentName = action.payload.componentName;
      state.modalText = action.payload.modalText || ''; // Capture the text
      state.audio = action.payload.audio;
      state.navigateTo = action.payload.navigateTo;


    },
    closeAssistant: (state) => {
      state.isOpen = false;
      state.modalText = '';

    },
  },
});

export const { openAssistan, closeAssistant } = AssistantSlice.actions;
export default AssistantSlice.reducer;
