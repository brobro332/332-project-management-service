import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link, Snackbar, Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
 
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await axios.post(
        `${config.API_BASE_URL}:${config.API_PORT}/api/v1/authentication`,
        { 
          email: email,
          password: password
        },
        { 
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }, 
          withCredentials: true
        }
      );
      
      if (result.status === 200) {
        navigate('/main');
      } else {
        setOpenSnackbar(true);
      }
    } catch (e) {
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#3D3D3D', 
        alignItems: 'center' }}>
      {/* 왼쪽 여백 */}
      <Box sx={{ flex: 5 }} /> 

      {/* 로그인 폼*/}
      <Box
        sx={{
          width: '300px',
          height: '40vh',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style = {{ display: 'flex' }}>
          <img 
            src='/resources/logo.png' 
            alt='logo' 
            width='30px' 
            height='30px' 
            style={{
              bottom: '0'
            }}>
          </img>
          <Typography variant='h5' align='center' sx={{ 
              marginBottom: '20px',
              paddingLeft: '10px',
              fontWeight: '700',
              color: '#3D3D3D' 
            }}>
            삼사미 프로젝트 매니저
          </Typography>
        </div>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* 입력 필드 */}
          <TextField
            label='이메일'
            onChange={(e) => setEmail(e.target.value)}
            variant='outlined'
            margin='normal'
            size='small'
            fullWidth
            sx={{ height: '20px' }}
          />
          <TextField
            label='비밀번호'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            variant='outlined'
            margin='normal'
            size='small'
            fullWidth
            sx={{ height: '20px' }}
          />
          <Button variant='contained' type="submit" color='primary' fullWidth sx={{ 
            marginTop: '20px',
            marginBottom: '20px' 
          }}>
            로그인
          </Button>
        </form>
        <Typography variant='body2' align='center'>
          📢 서비스 이용이 처음이신가요?{' '}
          <Link component={RouterLink} to="/join-form" underline="hover">
            회원가입
          </Link>
        </Typography>
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
          로그인에 실패하였습니다. 관리자에게 문의해주세요.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;