import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

export const fetchPosts = createAsyncThunk(`fetchPosts`, async () => {
    try {
        const postsdata = await axios.get(`https://batman-backend.onrender.com/getallposts`)

        return postsdata.data

    } catch (error) {
        console.log(error);
    }
})

const postSlice = createSlice({

    name: 'posts',

    initialState: {
        isLoading: false,
        data: [],
        isError: false
    },

    extraReducers: (builder) => {

        builder.addCase(fetchPosts.pending, (state) => {
            state.isLoading = true
        })

        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            state.isLoading = false
            state.data = action.payload
            state.isError = false
        })

        builder.addCase(fetchPosts.rejected, (state) => {
            state.isLoading = false
            state.isError = true
        })

    }
})

export default postSlice.reducer