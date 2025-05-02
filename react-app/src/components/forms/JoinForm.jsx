import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const JoinForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  const handleJoin = async () => {
    setIsLoading(true); 

    if (password !== confirmPassword) {
      setOpenSnackbar(true);
      setIsLoading(false);
      return;
    }

    const body = {
      email,
      password,
      name,
      description,
    };

    try {
      const result = await axios.post(
        `${config.API_BASE_URL}:${config.API_PORT}/api/v1/member`,
        body,
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }
      );
      if (result.status === 200) {
        navigate(`/welcome?name=${name}`);
      } else {
        setOpenSnackbar(true);
      }
    } catch (e) {
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  }

  const isFormFilled =
    email.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    name.trim() &&
    description.trim();

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#3D3D3D',
        alignItems: 'center',
      }}
    >
      {/* 왼쪽 여백 */}
      <Box sx={{ flex: 1 }} />

      {/* 회원가입 폼 */}
      <Box
        sx={{
          width: '300px',
          height: '90vh',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src='/resources/logo.png'
            alt='logo'
            width='30px'
            height='30px'
            style={{ bottom: '10' }}
          />
          <Typography
            variant='h5'
            align='center'
            sx={{
              paddingLeft: '10px',
              fontWeight: '700',
              color: '#3D3D3D',
            }}
          >
            삼사미 프로젝트 매니저
          </Typography>
        </div>

        {/* 입력 필드 */}
        <TextField
          label='이메일'
          variant='standard'
          margin='normal'
          size='small'
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label='비밀번호'
          type='password'
          variant='standard'
          margin='normal'
          size='small'
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label='비밀번호 확인'
          type='password'
          variant='standard'
          margin='normal'
          size='small'
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <TextField
          label='이름'
          variant='standard'
          margin='normal'
          size='small'
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          id='standard-multiline-static'
          label='소개'
          multiline
          rows={3}
          variant='standard'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleJoin}
          sx={{ marginTop: '20px', marginBottom: '20px' }}
          disabled={!isFormFilled}
          fullWidth
          loading={isLoading}
        >
          회원가입
        </Button>
        <Button
          variant='contained'
          color='inherit'
          onClick={handleCancel}
          fullWidth
        >
          취소
        </Button>
      </Box>

      {/* 오른쪽 여백 */}
      <Box sx={{ flex: 1 }} />

      {/* 메시지 알림 */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          icon={<CheckIcon fontSize="inherit" />}
        >
          회원가입에 실패하였습니다. 비밀번호 확인 또는 관리자에게 문의해주세요.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JoinForm;