import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workspaceList: [],
  workspace: null,
};

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspaceList: (state, action) => {
      state.workspaceList = action.payload;
    },
    setWorkspace: (state, action) => {
      state.workspace = action.payload;
    },
  },
});

export const { setWorkspaceList, setWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;