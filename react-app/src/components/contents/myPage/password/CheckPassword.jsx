import React, { useState } from "react";
import { Box, TextField, Button, Snackbar, Alert } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import axios from "axios";
import config from "../../../../config.js";

const CheckPassword = ({
  onCancel,
  onPasswordChecked
}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const isFormFilled = password.trim();
  
  const checkPassword = async () => {
    setIsLoading(true);
    try {
      const result = await axios.post(
        `${config.API_BASE_URL}:${config.API_PORT}/api/v1/authorization`,
        {
          password: password
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          withCredentials: true,
        }
      );

      if (result.status === 200) {
        onPasswordChecked();
      }
    } catch (e) {
      console.error(e);
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <TextField
        label="현재 비밀번호"
        type="password"
        variant="standard"
        margin="normal"
        size="small"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={checkPassword}
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

export default CheckPassword;