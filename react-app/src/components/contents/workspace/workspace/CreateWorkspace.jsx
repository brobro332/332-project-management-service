import React, { useEffect, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import axios from "axios";
import config from "../../../../config";

const CreateWorkspace = ({
  onCancel,
  onWorkspaceCreated,
  onWorkspaceUpdated,
  workspace,
  isEditing,
}) => {
  const [workspaceName, setWorkspaceName] = useState(workspace ? workspace.name : "");
  const [workspaceDescription, setWorkspaceDescription] = useState(
    workspace ? workspace.description : ""
  );
  const [isLoading, setIsLoading] = useState(false);

 const isFormFilled = workspaceName.trim() && workspaceDescription.trim();

  useEffect(() => {
    if (!isEditing) {
      setWorkspaceName('');
      setWorkspaceDescription('');
    }
  }, [isEditing]);

  const createWorkspace = async () => {
    setIsLoading(true);
    try {
      const result = await axios.post(
        `${config.API_BASE_URL}:${config.API_PORT}/api/v1/workspace`,
        {
          name: workspaceName,
          description: workspaceDescription
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          withCredentials: true,
        }
      );

      if (result.status === 200) {
        onWorkspaceCreated();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkspace = async () => {
    setIsLoading(true);
    try {
      const result = await axios.put(
        `${config.API_BASE_URL}:${config.API_PORT}/api/v1/workspace/` + workspace.id,
        {
          id: workspace.id,
          name: workspaceName,
          description: workspaceDescription
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          withCredentials: true,
        }
      );

      if (result.status === 200) {
        onWorkspaceUpdated();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <TextField
        label="워크스페이스 이름"
        variant="standard"
        margin="normal"
        size="small"
        fullWidth
        value={workspaceName}
        onChange={(e) => setWorkspaceName(e.target.value)}
      />
      <TextField
        label="워크스페이스 설명"
        variant="standard"
        margin="normal"
        size="small"
        fullWidth
        value={workspaceDescription}
        onChange={(e) => setWorkspaceDescription(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={isEditing ? updateWorkspace : createWorkspace}
        color="primary"
        sx={{ marginTop: "20px", marginBottom: "20px" }}
        disabled={!isFormFilled || isLoading}
        fullWidth
        loading={isLoading}
      >
        {isEditing
          ? "수정"
          : "생성"}
      </Button>
      <Button variant="contained" onClick={onCancel} color="inherit" fullWidth>
        취소
      </Button>
    </Box>
  );
};

export default CreateWorkspace;