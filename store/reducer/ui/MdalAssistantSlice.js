// store/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const modalAssistantSlice = createSlice({
  name: 'ModalAssistant',
  initialState: {
    isOpen: false,
    componentName: '',
    modalText: '',

  },
  reducers: {
    openAssisModal: (state, action) => {
      state.isOpen = true;
      state.componentName = action.payload.componentName;
      state.modalText = action.payload.modalText || ''; // Capture the text

    },
    closeAssisModal: (state) => {
      state.isOpen = false;
      state.modalText = '';

    },
  },
});

export const { openAssisModal, closeAssisModal } = modalAssistantSlice.actions;
export default modalAssistantSlice.reducer;
