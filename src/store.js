import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./features/adminSlice";
import adminSupportReducer from "./features/adminSupportSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    adminSupport: adminSupportReducer,
  },
});
