import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, TextField, Table, TableContainer, Pagination, TableCell, TableBody, TableRow, TableHead, Paper } from "@mui/material";
import axios from "axios";
import config from "../../../../config";

const CreateInvitation = ({ workspace }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [memberList, setMemberList] = useState([]); 
  const [page, setPage] = useState(1);

  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;
  const currentPageData = memberList.slice(startIndex, startIndex + pageSize);

  const readMemberListNotInWorkspace = useCallback(async () => {
    try {
      const result = await axios.get(
        `${config.API_BASE_URL}:${config.API_PORT}/api/v1/member/memberList-not-in-workspace`,
        {
          params: { 
            email: email?.trim(),
            name: name?.trim(),
            workspaceId: workspace,
           },
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
  }, [email, name, workspace]);

  useEffect(() => {
    readMemberListNotInWorkspace();
  }, [readMemberListNotInWorkspace]);

  const createInvitation = async (row) => {
    try {
      const result = await axios.post(
        `${config.API_BASE_URL}:${config.API_PORT}/api/v1/invitation`,
        {
          memberEmail: row.email,
          workspaceId: workspace,
          requesterType: 'WORKSPACE'
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          withCredentials: true
        }
      );

      if (result.status === 200) {
        readMemberListNotInWorkspace();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteInvitation = async (row) => {
    try {
      const result = await axios.delete(
        `${config.API_BASE_URL}:${config.API_PORT}/api/v1/invitation`,
        {
          data: {
            id: row.invitationId
          },
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          withCredentials: true
        }
      );

      if (result.status === 200) {
        readMemberListNotInWorkspace();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box>
      <Box display="flex" gap={2} sx={{ marginBottom:"15px" }}>
        <TextField 
          label="이메일" 
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
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "20%" }}>이메일</TableCell>
                <TableCell sx={{ width: "20%" }}>이름</TableCell>
                <TableCell sx={{ width: "30%" }}>소개</TableCell>
                <TableCell sx={{ width: "10%" }}>처리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {currentPageData.map((member) => (
              <TableRow key={member.id} sx={{ height: "30px" }}>
                <TableCell sx={{ paddingBottom: "5px", paddingTop: "5px" }}>
                  {member.email}
                </TableCell>
                <TableCell sx={{ paddingBottom: "5px", paddingTop: "5px" }}>
                  {member.name}
                </TableCell>
                <TableCell sx={{ paddingBottom: "5px", paddingTop: "5px" }}>
                  {member.description}
                </TableCell>
                <TableCell sx={{ paddingBottom: "5px", paddingTop: "5px" }}>
                  {member.status === null ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => createInvitation(member)}
                    >
                      초대
                    </Button>
                  ) : (
                    member.status === 'PENDING' ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteInvitation(member)}
                      >
                        취소
                      </Button>
                    ) : (
                      member.status === 'ACCEPTED' ? '가입완료' : '거절' 
                    ) 
                  )}
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
          {memberList && (
            <Pagination
              count={Math.ceil(memberList.length / pageSize)}
              page={page}
              color="primary"
              onChange={handlePageChange}
              sx={{ height: "50px", display: "flex", justifyContent: "center" }}
            />
          )}
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CreateInvitation;