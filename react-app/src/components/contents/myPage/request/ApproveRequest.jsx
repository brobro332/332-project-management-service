import React, { useCallback, useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Paper, IconButton, Menu } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import config from "../../../../config";

const ApproveRequest = () => {
  const [page, setPage] = useState(0);
  const [division, setDivision] = useState('ALL');
  const [workspaceName, setWorkspaceName] = useState('');
  const [invitationList, setInvitationList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;
  const currentPageData = invitationList.slice(startIndex, startIndex + pageSize);

  const readInvitation = useCallback(async () => {
    try {
      const result = await axios.get(
        `${config.API_BASE_URL}:${config.API_PORT}/api/v1/invitation`,
        {
          params: { 
            workspaceName: workspaceName?.trim(),
            division: division?.trim() === 'ALL' ? '' : division,
            menu: 'MY_PAGE'
           },
          withCredentials: true,
        }
      );
      if (result.status === 200) {
        const invitationList = result.data.data;

        setPage(1);
        setInvitationList(invitationList);
      }
    } catch (e) {
      console.error(e);
    }
  }, [division, workspaceName]);

  useEffect(() => {
    readInvitation();
  }, [readInvitation]);

  const updateInvitation = async (row, flag) => {
    try {
      const result = await axios.put(
        "http://localhost:8080/api/v1/invitation",
        {
          id: row.id,
          status: flag,
          workspaceId: row.workspaceId
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          withCredentials: true
        }
      );

      if (result.status === 200) {
        readInvitation();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteInvitation = async (row) => {
    try {
      const result = await axios.delete(
        "http://localhost:8080/api/v1/invitation",
        {
          data: {
            id: row.id
          },
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          withCredentials: true
        }
      );

      if (result.status === 200) {
        readInvitation();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box>
      <Box display="flex" gap={2} sx={{ marginBottom:"15px" }}>
        <FormControl size="small" sx={{ flex: 1 }}>
        <InputLabel>구분</InputLabel>
        <Select value={division} onChange={(e) => setDivision(e.target.value)}>
            <MenuItem value="ALL">전체</MenuItem>
            <MenuItem value="WORKSPACE">발신</MenuItem>
            <MenuItem value="MEMBER">수신</MenuItem>
        </Select>
        </FormControl>
        <TextField 
        label="워크스페이스 이름" 
        variant="outlined" 
        size="small" 
        sx={{ flex: 1 }}
        value={workspaceName}
        onChange={(e) => setWorkspaceName(e.target.value)} 
        />
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "10%" }}>구분</TableCell>
                <TableCell sx={{ width: "30%" }}>워크스페이스 이름</TableCell>
                <TableCell sx={{ width: "40%" }}>소개</TableCell>
                <TableCell sx={{ width: "10%" }}>상태</TableCell>
                <TableCell sx={{ width: "10%" }}>처리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageData.map((invitation) => (
              <TableRow key={invitation.id} sx={{ height: "30px" }}>
                <TableCell sx={{ paddingBottom: "5px", paddingTop: "5px" }}>
                  {invitation.division}
                </TableCell>
                <TableCell sx={{ paddingBottom: "5px", paddingTop: "5px" }}>
                  {invitation.workspaceName}
                </TableCell>
                <TableCell sx={{ paddingBottom: "5px", paddingTop: "5px" }}>
                  {invitation.workspaceDescription}
                </TableCell>
                <TableCell sx={{ paddingBottom: "5px", paddingTop: "5px" }}>
                  {(() => {
                    switch (invitation.status) {
                      case 'PENDING':
                        return '미응답';
                      case 'ACCEPTED':
                        return '수락';
                      case 'REJECTED':
                        return '거절';
                      default:
                        return '알 수 없음';
                    }
                  })()}
                </TableCell>
                <TableCell sx={{ paddingBottom: "5px", paddingTop: "5px" }}>
                  <IconButton
                    color="inherit"
                    onClick={(event) => handleMenuOpen(event, invitation)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  {/* 드롭다운 메뉴 */}
                  <Menu
                    anchorEl={anchorEl}
                    open={selectedRow === invitation}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    {invitation.division === '발신' ? (
                      <MenuItem onClick={() => deleteInvitation(invitation)}>
                        삭제
                      </MenuItem>
                    ) : invitation.status === 'PENDING' ? (
                      <>
                        <MenuItem onClick={() => updateInvitation(invitation, 'ACCEPTED')}>
                          수락
                        </MenuItem>
                        <MenuItem onClick={() => updateInvitation(invitation, 'REJECTED')}>
                          거절
                        </MenuItem>
                      </>
                    ) : (
                      <MenuItem onClick={() => deleteInvitation(invitation)}>
                        삭제
                      </MenuItem>
                    )
                  }
                  </Menu>
                </TableCell>
              </TableRow>
              ))}
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
            onChange={handlePageChange}
          />
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ApproveRequest;