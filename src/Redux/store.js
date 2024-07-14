import { configureStore } from "@reduxjs/toolkit";
import pReducer from './postSlice.js'

export const store = configureStore({
    reducer: {
        'posts': pReducer
    }
})