import { createSlice } from "@reduxjs/toolkit";
import { addRun } from "./matchSlice.js";
import { addWicket } from "./matchSlice.js";

const playerSlice = createSlice({
    name: "player",
    initialState: {
        name: "",
        playerRuns: 0,
        playerWickets: 0,
    },
    reducers: {
        setPlayerName: (state, action) => {
            state.name = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder.addCase(addRun, (state, action) => {
            state.playerRuns += action.payload;
        });

        builder.addCase(addWicket, (state, action) => {
            state.playerWickets += action.payload;
        });
    }
});

export const { setPlayerName } = playerSlice.actions;
export default playerSlice.reducer;
