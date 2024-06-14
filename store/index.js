// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './reducer/ui/ModalSlice';
import AssistantReducer from './reducer/ui/AssistantSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    assistant : AssistantReducer,
  },
});
