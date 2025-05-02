import React, { useState } from "react";
import { Box, TextField, Button, Snackbar, Alert } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import axios from "axios";
import config from "../../../../config";

const UpdatePassword = ({
  onCancel,
  onPasswordUpdated
}) => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
      
  const isFormFilled = password.trim() && newPassword.trim();
  
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      if (password !== newPassword) {
        setOpenSnackbar(true);
        return;
      }

      const body = {
        password: password
      };

      const result = await axios.put(
        `${config.API_BASE_URL}:${config.API_PORT}/api/v1/member/password"`,
        body,
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          withCredentials: true,
        }
      );

      if (result.status === 200) {
        onPasswordUpdated();
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
        label="변경 비밀번호"
        type="password"
        variant="standard"
        margin="normal"
        size="small"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="비밀번호 확인"
        type="password"
        variant="standard"
        margin="normal"
        size="small"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={handleUpdate}
        color="primary"
        sx={{ marginTop: "20px", marginBottom: "20px" }}
        disabled={!isFormFilled || isLoading}
        fullWidth
        loading={isLoading}
      >
        확인
      </Button>
      <Button variant="contained" onClick={onCancel} color="inherit" fullWidth>
        취소
      </Button>
      
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
          비밀번호가 일치하지 않습니다. 다시 입력해주세요.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdatePassword;