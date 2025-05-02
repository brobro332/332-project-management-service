import React, { useCallback, useEffect, useState } from "react";
import { Box, Card, Chip, Divider, Typography } from "@mui/material";
import CreateWorkspace from "./workspace/CreateWorkspace";
import ReadWorkspace from "./workspace/ReadWorkspace";
import MemberTable from "./workspace/MemberTable";
import ManageJoin from "./invitation/ManageJoin";
import axios from "axios";
import ConfirmDialog from "../../tags/ConfirmDialog";
import config from "../../../config";
import { setWorkspaceList, setWorkspace } from '../../../features/workspace/workspaceSlice';
import { useDispatch, useSelector } from 'react-redux';

const WorkspaceMain = () => {
  const [memberList, setMemberList] = useState([]);
  const [page, setPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dispatch = useDispatch();
  const workspaceList = useSelector((state) => state.workspace.workspaceList);
  const workspace = useSelector((state) => state.workspace.workspace);

  const readWorkspaceList = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}:${config.API_PORT}/api/v1/workspace/workspaceList`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const workspaceList = response.data.data;

        if (workspaceList.length > 0) {
          dispatch(setWorkspaceList(workspaceList));
          dispatch(setWorkspace(workspaceList[0]));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  const deleteWorkspace = async () => {
    try {
      const resultObject = await axios.delete(
        `${config.API_BASE_URL}:${config.API_PORT}/api/v1/workspace/` + workspace.id,
        {
          withCredentials: true
        }
      );
      if (resultObject.status === 200) {
        readWorkspaceList();
        setIsDialogOpen(false);
      }
    } catch (e) {
      console.error(e);
    } 
  };

  const readMemberListInWorkspace = useCallback(async () => {
    if (workspace !== null) {
      try {
        const result = await axios.get(
          `${config.API_BASE_URL}:${config.API_PORT}/api/v1/member/memberList-in-workspace`,
          {
            params: { workspaceId: workspace.id },
            withCredentials: true,
          }
        );
        if (result.status === 200) {
          const memberList = result.data.data;

          setPage(1);
          setMemberList(memberList);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [workspace]);

  useEffect(() => {
    console.log('현재 워크스페이스:', workspace);
    readMemberListInWorkspace();
  }, [readMemberListInWorkspace, workspace]);

  const handleCreateWorkspace = () => {
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEditWorkspace = () => {
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleAddMember = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  }

  const handleDeleteButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleWorkspaceCreated = () => {
    setIsCreating(false);
    readWorkspaceList();
  };

  const handleWorkspaceUpdated = () => {
    setIsEditing(false);
    readWorkspaceList();
  };

  const handleWorkspaceDeleted = () => {
    deleteWorkspace();
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom : '10px' }}>워크스페이스</Typography>
      <Divider sx={{ marginBottom : '15px' }}/>
      {isCreating || isEditing ? (
        <CreateWorkspace
          onCancel={handleCancel}
          onWorkspaceCreated={handleWorkspaceCreated}
          onWorkspaceUpdated={handleWorkspaceUpdated}
          workspace={workspace}
          isEditing={isEditing}
        />
      ) : (
        <>
          {isAdding ? (
            <ManageJoin
              onCancel={handleCancelAdd}
              workspace={workspace.id} 
            />
          ) : (
            <>
              <ReadWorkspace
                workspaceList={workspaceList}
                onCreateWorkspace={handleCreateWorkspace}
                onEditWorkspace={handleEditWorkspace}
                onAddMember={handleAddMember}
                handleDeleteButtonClick={handleDeleteButtonClick}
                workspace={workspace}
                setWorkspace={setWorkspace}
                memberList={memberList}
                page={page}
              />
              {workspaceList.length > 0 && (
                <>
                  <Card variant="outlined" sx={{ padding: 2, marginTop: 2, maxWidth: 600 }}>
                    <Typography variant="body2">
                      <Chip label="이름" color="primary" variant="outlined" />
                      {' '}{workspace?.name}
                      <Chip label="설명" color="primary" sx={{ ml: 3 }} variant="outlined" />
                      {' '}{workspace?.description}
                    </Typography>
                  </Card>
                  <ConfirmDialog 
                    open={isDialogOpen}
                    onConfirm={handleWorkspaceDeleted}
                    onClose={handleCancelDelete}
                    title={'워크스페이스 삭제'} 
                    content={'해당 워크스페이스를 정말 삭제하시겠습니까?\n삭제된 워크스페이스는 복구할 수 없습니다.'}
                  />
                  <MemberTable 
                    memberList={memberList} 
                    page={page}
                    workspace={workspace} 
                    onPageChange={handlePageChange}
                    onChange={readMemberListInWorkspace}
                  />
                </>
              )}   
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default WorkspaceMain;