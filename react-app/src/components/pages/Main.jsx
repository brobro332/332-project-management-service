import React, { useCallback, useEffect, useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemText, CssBaseline, IconButton, Snackbar, Alert, MenuItem, Menu, FormControl, InputLabel, Select } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import WorkspaceMain from '../contents/workspace/WorkspaceMain';
import { useNavigate } from 'react-router-dom';
import MyPageMain from '../contents/myPage/MyPageMain';
import ProjectMain from '../contents/project/ProjectMain';
import config from "../../config";
import axios from 'axios';
import { setWorkspaceList, setWorkspace } from '../../features/workspace/workspaceSlice';
import { useDispatch, useSelector } from 'react-redux';

const Main = () => {
  const [selectedMenu, setSelectedMenu] = useState('대시보드');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const workspaceList = useSelector((state) => state.workspace.workspaceList);
  const workspace = useSelector((state) => state.workspace.workspace);
  
  const open = Boolean(anchorEl);

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

  useEffect(() => {
    setOpenSnackbar(true);
  }, []);

  useEffect(() => {
    readWorkspaceList();
  }, [readWorkspaceList]);

  const navigate = useNavigate();

  const handleMenuClick = (menuName) => {
    setAnchorEl(null);
    setSelectedMenu(menuName);
  };

  const handleAppsListOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAppsListClose = () => {
    setAnchorEl(null);
  };

  const renderContent = () => {
    switch (selectedMenu) {
       case '대시보드':
        return (
          <div>
            <Typography variant="h5">대시보드</Typography>
            <Typography variant="body1">여기는 대시보드 페이지입니다.</Typography>
          </div>
        );
      case '타임라인':
        return (
          <div>
            <Typography variant="h5">타임라인</Typography>
            <Typography variant="body1">여기는 타임라인 페이지입니다.</Typography>
          </div>
        );
      case '프로젝트':
        return (
          <ProjectMain/>
        );
      case '스프린트':
        return (
          <div>
            <Typography variant="h5">스프린트</Typography>
            <Typography variant="body1">여기는 스프린트 페이지입니다.</Typography>
          </div>
        );
      case '워크스페이스':
        return (
          <WorkspaceMain/>
        );
      case '마이페이지':
        return (
          <MyPageMain />
        );
      default:
        return (
          <div>
            <Typography variant="h5">대시보드</Typography>
            <Typography variant="body1">여기는 대시보드 페이지입니다.</Typography>
          </div>
        );
    }
  };

    return (
      <Box sx={{ display: 'flex' }}>
        {/* 기본 스타일 초기화 */}
        <CssBaseline />

        {/* 고정 헤더 */}
        <AppBar position='fixed' sx={{ 
            width: '100%'
        , zIndex: 1201
        , backgroundColor: '#3D3D3D' 
        }}>
          <Toolbar>
            <img 
            src='/resources/logo.png' 
            alt='logo' 
            width='30px' 
            height='30px' 
            style={{
                bottom: '0'
            }}>
            </img>
            <Typography 
            variant='h6'
            style={{
                paddingLeft: '10px'
            }}>
            삼사미 프로젝트 매니저
            </Typography>
            <IconButton color='inherit' onClick={handleAppsListOpen} sx={{ ml: 'auto' }}>
              <AppsIcon />
            </IconButton>

            {/* 드롭다운 메뉴 */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleAppsListClose}
              anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
              }}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}>
              <MenuItem onClick={() => handleMenuClick('마이페이지')}>마이페이지</MenuItem>
              <MenuItem onClick={() => navigate('/')}>로그아웃</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* 사이드바 */}
        <Drawer
        sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            top: 64,
            height: 'calc(100% - 64px)',
            color: 'white',
            backgroundColor: '#3D3D3D'
            },
        }}
        variant='permanent'
        anchor='left'
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl variant="filled" sx={{ 
              width: "70%",
              backgroundColor: "#fff",
              mt: 2,
              ml: 1,
              borderRadius: 1
            }}>
              <InputLabel id="select-workspace">워크스페이스 선택</InputLabel>
              {workspace && (
                <Select
                  labelId="select-workspace"
                  id="select-workspace"
                  size="small"
                  value={workspace?.id}
                  label="워크스페이스 선택"
                  onChange={(e) => {
                    const selectedWorkspace = workspaceList.find((workspace) => workspace.id === e.target.value);
                    dispatch(setWorkspace(selectedWorkspace));
                  }}
                >
                  {workspaceList.map((workspace) => (
                    <MenuItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
            <IconButton
              size="large"
              sx={{
                mt: 2
              }}
              edge="end"
              color="inherit"
              onClick={() => handleMenuClick('워크스페이스')}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
          
          <List sx={{ size: 'lg' }}>
            <ListItem button='true' onClick={() => handleMenuClick('대시보드')}>
              <ListItemText primary='대시보드' />
            </ListItem>
            <ListItem button='true' onClick={() => handleMenuClick('타임라인')}>
              <ListItemText primary='타임라인' />
            </ListItem>
            {workspaceList.length > 0 && (
              <ListItem button='true' onClick={() => handleMenuClick('프로젝트')}>
                <ListItemText primary='프로젝트' />
              </ListItem>
            )}
            <ListItem button='true' onClick={() => handleMenuClick('스프린트')}>
              <ListItemText primary='스프린트' />
            </ListItem>
          </List>
        </Drawer>

        {/* 메인 콘텐츠 영역 */}
        <Box
        component='main'
        sx={{
          bgcolor: 'background.default',
          pt: 10,
          width: '100%'
        }}
        >
        {/* 메인 컨텐츠 */}
          <Container maxWidth={false} sx={{ 
            pl: 2
          }}>
            {renderContent()}
          </Container>
        </Box>
        
        {/* 메시지 알림 */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            icon={<CheckIcon fontSize="inherit" />}
          >
            환영합니다.
          </Alert>
        </Snackbar>
      </Box>
    );
};

export default Main;