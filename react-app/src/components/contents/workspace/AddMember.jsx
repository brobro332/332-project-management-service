import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, Typography, MenuItem, Button, FormControl, InputLabel, Select, TextField, Table, TableContainer, Pagination, TableCell, TableBody, TableRow, TableHead, Paper } from "@mui/material";
import axios from "axios";
import config from "../../../config";

const AddMember = ({ onAddMember }) => {
  const [value, setValue] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [page, setPage] = useState(0);
  const [invitationDivision, setInvitationDivision] = useState('');
  const [invitationList, setInvitationList] = useState(null);

  useEffect(() => {
    const readInvitation = async () => {
      try {
        const result = await axios.get(
          `${config.API_BASE_URL}:${config.API_PORT}/api/v1/invitation`,
          {
            params: { 
              email: email?.trim(),
              name: name?.trim(),
              workspaceId: onAddMember,
              invitationDivision: division?.trim()
             },
            withCredentials: true,
          }
        );
        if (result.status === 200) {
          const invitationList = result.data.data;

          setPage(invitationList.length);
          setInvitationList(invitationList);
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    readInvitation();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs 
        value={value} 
        onChange={handleChange} 
        centered 
        variant="scrollable" 
        scrollButtons="auto"
      >
        <Tab label="가입요청" />
        <Tab label="멤버초대" />
        <Tab label="초대링크" />
      </Tabs>
      
      <Box sx={{ p: 2, mt: 2, border: "1px solid #ddd", borderRadius: 2 }}>
        {value === 0 && (
          <>
            <Box display="flex" gap={2}>
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel>구분</InputLabel>
                <Select value={invitationDivision} onChange={(e) => setInvitationDivision(e.target.value)}>
                  <MenuItem value="WORKSPACE">발신</MenuItem>
                  <MenuItem value="MEMBER">수신</MenuItem>
                </Select>
              </FormControl>
              <TextField 
                label="아이디" 
                variant="outlined" 
                size="small" 
                sx={{ flex: 1 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
              <TextField 
                label="이름" 
                variant="outlined" 
                size="small" 
                sx={{ flex: 1 }} 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button variant="contained" color="primary">조회</Button>
            </Box>
            <Box>
              <TableContainer component={Paper}>
                <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "10%" }}>구분</TableCell>
                      <TableCell sx={{ width: "30%" }}>이메일</TableCell>
                      <TableCell sx={{ width: "20%" }}>이름</TableCell>
                      <TableCell sx={{ width: "30%" }}>소개</TableCell>
                      <TableCell sx={{ width: "10%" }}>처리</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  </TableBody>
                </Table>
                <Pagination
                  page={page}
                  color="primary"
                  sx={{
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              </TableContainer>
            </Box>
          </>
        )}
        {value === 1 && (
          <Box>
            <>
              <Box display="flex" gap={2}>
                <TextField label="아이디" variant="outlined" size="small" sx={{ flex: 1 }} />
                <TextField label="이름" variant="outlined" size="small" sx={{ flex: 1 }} />
                <Button variant="contained" color="primary">조회</Button>
              </Box>
              <Box>
                <TableContainer component={Paper}>
                  <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: "30%" }}>이메일</TableCell>
                        <TableCell sx={{ width: "20%" }}>이름</TableCell>
                        <TableCell sx={{ width: "40%" }}>소개</TableCell>
                        <TableCell sx={{ width: "10%" }}>처리</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    </TableBody>
                  </Table>
                  <Pagination
                    count={Math.ceil(invitationList.length / 10)}
                    page={page}
                    color="primary"
                    sx={{
                      height: "50px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  />
                </TableContainer>
              </Box>
            </>
          </Box>
        )}
        {value === 2 && (
          <Box>
            <Typography variant="h6">권한설정</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AddMember;