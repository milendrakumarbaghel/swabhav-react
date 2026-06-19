    import { createSlice } from "@reduxjs/toolkit";
    const matchSlice = createSlice({
    name: "match",
    initialState: {
        runs : 0,
        wickets : 0,
        overs : 0,
        balls : 0,
        },
        reducers: {
            addRun: (state, action) => {
                state.runs += action.payload;
            },
            addWicket: (state) => {
                state.wickets += 1;
            },
            addBall: (state) => {
                state.balls += 1;
                if (state.balls === 6) {
                    state.overs += 1;
                    state.balls = 0;
                }
            },
            resetMatch: (state) => {
                state.runs = 0;
                state.wickets = 0;
                state.overs = 0;
                state.balls = 0;
            },
        },
    });

    export const { addRun, addWicket, addBall, resetMatch } = matchSlice.actions;
    export default matchSlice.reducer;
