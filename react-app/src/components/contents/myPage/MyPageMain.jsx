import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Card, Chip, Button } from "@mui/material";
import axios from "axios";
import UpdateMember from "./profile/UpdateMember";
import CheckPassword from "./password/CheckPassword";
import UpdatePassword from "./password/UpdatePassword";
import ConfirmDialog from '../../tags/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import ManageRequest from './request/ManageRequest';
import config from '../../../config';

const MyPageMain = () => {
  const [member, setMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();

  const readMember = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}:${config.API_PORT}/api/v1/member`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const member = response.data.data;

        if (member !== null) {
          setMember(member);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMember = async () => {
    try {
      const resultObject = await axios.delete(
        `${config.API_BASE_URL}:${config.API_PORT}/api/v1/member`,
        {
          withCredentials: true
        }
      );
      if (resultObject.status === 200) {
        navigate('/');
      }
    } catch (e) {
      console.error(e);
    } 
  };

  const handleProfileEdited = () => {
    setIsEditing(false);
    readMember();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChecking(false);
    setIsUpdatingPassword(false);
    setIsManaging(false);
  };

  const handleCheckPassword = () => {
    setIsChecking(false);
    setIsUpdatingPassword(true);
  };

  const handleUpdatePassword = () => {
    setIsUpdatingPassword(false);
  };

  const handleCancelManaging = () => {
    setIsManaging(false);
  };

  const handleMemberDeleted = () => {
    deleteMember();
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-CA");
  };

  useEffect(() => {
    readMember();
  }, []);

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>마이페이지</Typography>
      <Divider sx={{ marginBottom: '15px' }} />
      {isEditing ? (
        <>
          <UpdateMember 
            member={member} 
            onCancel={handleCancel} 
            onProfileEdited={handleProfileEdited} 
          />
        </>
      ) : (
        <>
          {isChecking ? (
            <CheckPassword
              onCancel={handleCancel}
              onPasswordChecked={handleCheckPassword}
            />
          ) : (
            <>
              {isUpdatingPassword ? (
                <UpdatePassword 
                  onCancel={handleCancel}
                  onPasswordUpdated={handleUpdatePassword}
                />
              ) : (
                <>
                  {isManaging ? (
                    <ManageRequest
                      onCancel={handleCancelManaging}
                    />
                  ) : (
                    <>
                      <Button variant="contained" color="primary" onClick={() => {setIsEditing(true);}}>
                        정보편집
                      </Button>
                      <Button
                        onClick={()=>{setIsChecking(true);}}
                        variant="contained"
                        color="primary"
                        sx={{ marginLeft: "10px" }}
                      >
                        패스워드변경
                      </Button>
                      <Button
                        onClick={()=>{setIsManaging(true);}}
                        variant="contained"
                        color="primary"
                        sx={{ marginLeft: "10px" }}
                      >
                        요청관리
                      </Button>
                      <Button
                        variant="contained"
                        onClick={()=>{setIsDialogOpen(true);}}
                        color="error"
                        sx={{ marginLeft: "10px" }}
                      >
                        회원탈퇴
                      </Button>
                      <ConfirmDialog 
                        open={isDialogOpen}
                        onConfirm={handleMemberDeleted}
                        onClose={handleCancelDelete}
                        title={'회원탈퇴'} 
                        content={'정말 회원 탈퇴하시겠습니까?\n30일 안에 재접속을 통해 복구 가능하며, 이후에 회원정보가 삭제됩니다.'}
                      />
                      <Card variant="outlined" sx={{ padding: 2, marginTop: 2, width: '50%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                          <Box sx={{ flex: 1, marginRight: 2 }}>
                            <Chip label="아이디" color="primary" variant="outlined" />
                          </Box>
                          <Typography variant="body2" sx={{ flex: 5 }}>
                            {member?.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                          <Box sx={{ flex: 1, marginRight: 2 }}>
                            <Chip label="이름" color="primary" variant="outlined" />
                          </Box>
                          <Typography variant="body2" sx={{ flex: 5 }}>
                            {member?.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                          <Box sx={{ flex: 1, marginRight: 2 }}>
                            <Chip label="소개" color="primary" variant="outlined" />
                          </Box>
                          <Typography variant="body2" sx={{ flex: 5 }}>
                            {member?.description}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                          <Box sx={{ flex: 1, marginRight: 2 }}>
                            <Chip label="생성일자" color="primary" variant="outlined" />
                          </Box>
                          <Typography variant="body2" sx={{ flex: 5 }}>
                            {member?.createdAt ? formatDate(member.createdAt) : '-'}
                          </Typography>
                        </Box>
                      </Card>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default MyPageMain;