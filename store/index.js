// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './reducer/ui/ModalSlice';
import ModalAssistantReducer from './reducer/ui/MdalAssistantSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    ModalAssistant: ModalAssistantReducer,
  },
});
