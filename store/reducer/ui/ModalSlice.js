// store/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isOpen: false,
    componentName: '',
    modalText: '',
    navigateTo:''

  },
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.componentName = action.payload.componentName;
      state.modalText = action.payload.modalText || ''; // Capture the text
      state.navigateTo = action.payload.navigateTo;

    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalText = '';

    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
