import React, { useCallback, useEffect, useState } from "react";
import { Box, Divider, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import axios from "axios";
import config from "../../../config";
import { Link } from "react-router-dom";
import { setWorkspaceList, setWorkspace } from '../../../features/workspace/workspaceSlice';
import { useDispatch, useSelector } from 'react-redux';

const ProjectMain = () => {
  const [projectList, setProjectList] = useState([]);
  const [project, setProject] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const dispatch = useDispatch();
  const workspaceList = useSelector((state) => state.workspace.workspaceList);
  const workspace = useSelector((state) => state.workspace.workspace);

  const readWorkspaceList = useCallback(async () => {
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
  }, [dispatch]);

  const readProjectList = useCallback(async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}:${config.API_PORT}/api/v1/project/projectList`, 
        {
          params: { workspaceId: workspace.id },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const projectList = response.data.data;

        if (projectList.length > 0) {
          setProjectList(projectList);
          setProject(projectList[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [workspace.id]);

  useEffect(() => {
    readWorkspaceList();
    readProjectList();
  }, [readProjectList]);

  const handleCreateProject = () => {
    setIsCreating(true);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom : '10px' }}>프로젝트</Typography>
      <Divider sx={{ marginBottom : '15px' }}/>
      {workspace != null && projectList.length > 0 ? (
        <FormControl sx={{ width: "30%" }}>
          <InputLabel id="select-project">프로젝트 선택</InputLabel>
          <Select
            labelId="select-project"
            id="select-project"
            size="small"
            value={project?.id}
            label="프로젝트 선택"
            onChange={(e) => {
              const selectedProject = projectList.find((project) => project.id === e.target.value);
              console.log(project.id);
              console.log(e.target.value);
              setProject(selectedProject);
            }}
          >
            {workspaceList.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Box sx={{ marginTop: '15px' }}>
          생성된 프로젝트가 없습니다.{" "}
          <Link onClick={handleCreateProject} underline="hover">
            프로젝트 생성
          </Link>
        </Box>
      )}{" "}
    </Box>
  );
};

export default ProjectMain;