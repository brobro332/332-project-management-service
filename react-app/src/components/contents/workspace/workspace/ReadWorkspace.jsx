import React from "react";
import { Box, Button, Link } from "@mui/material";

const ReadWorkspace = ({
  workspaceList,
  onCreateWorkspace,
  onEditWorkspace,
  onAddMember,
  handleDeleteButtonClick,
}) => (
  <Box>
    {workspaceList.length > 0 ? (
      <div>
        <Button variant="contained" color="primary" onClick={onCreateWorkspace}>
          워크스페이스 생성
        </Button>
        <Button
          variant="contained"
          onClick={onEditWorkspace}
          color="primary"
          sx={{ marginLeft: "10px" }}
        >
          워크스페이스 편집
        </Button>
        <Button 
          variant="contained" 
          onClick={onAddMember}
          color="primary" 
          sx={{ marginLeft: "10px" }}
        >
          가입관리
        </Button>
        <Button
          variant="contained"
          onClick={handleDeleteButtonClick}
          color="error"
          sx={{ marginLeft: "10px" }}
        >
          워크스페이스 삭제
        </Button>
      </div>
    ) : (
      <Box>
        생성된 워크스페이스가 없습니다.{" "}
        <Link onClick={onCreateWorkspace} underline="hover">
          워크스페이스 생성
        </Link>
      </Box>
    )}
  </Box>
);

export default ReadWorkspace;