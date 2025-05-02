package kr.co.co_working.member.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import kr.co.co_working.common.dto.ResponseDto;
import kr.co.co_working.member.dto.MemberRequestDto;
import kr.co.co_working.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
public class MemberApiController {
    private final MemberService service;

    @Operation(summary = "멤버 등록", description = "새로운 멤버를 등록합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "멤버 등록 완료"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터")
    })
    @PostMapping("/api/v1/member")
    public ResponseDto<?> createMember(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "멤버 등록 요청 DTO",
                    required = true,
                    content = @Content(schema = @Schema(implementation = MemberRequestDto.CREATE.class)))
            @RequestBody MemberRequestDto.CREATE dto) throws NoSuchElementException, Exception {
        service.createMember(dto);

        return ResponseDto.ofSuccess("멤버 등록에 성공했습니다.");
    }

    /**
     * readMember : Member 조회
     * @return
     * @throws Exception
     */
    @GetMapping("/api/v1/member")
    public ResponseDto<?> readMember() throws Exception {
        return ResponseDto.ofSuccess("멤버 조회에 성공했습니다.", service.readMember());
    }

    /**
     * readMemberList : MemberList 조회
     * @param dto
     * @return
     * @throws Exception
     */
    @GetMapping("/api/v1/member/memberList")
    public ResponseDto<?> readMemberList(@RequestBody MemberRequestDto.READ dto) throws Exception {
        return ResponseDto.ofSuccess("멤버목록 조회에 성공했습니다.", service.readMemberList(dto));
    }

    /**
     * readMemberListInWorkspace : 특정 Workspace 소속 MemberList 조회
     * @param dto
     * @return
     * @throws Exception
     */
    @GetMapping("/api/v1/member/memberList-in-workspace")
    public ResponseDto<?> readMemberListInWorkspace(@ModelAttribute MemberRequestDto.READ dto) throws Exception {
        return ResponseDto.ofSuccess("멤버목록 조회에 성공했습니다.", service.readMemberListInWorkspace(dto));
    }

    /**
     * readMemberListNotInWorkspace : 특정 Workspace 미가입 MemberList 조회
     * @param dto
     * @return
     * @throws Exception
     */
    @GetMapping("/api/v1/member/memberList-not-in-workspace")
    public ResponseDto<?> readMemberListNotInWorkspace(@ModelAttribute MemberRequestDto.READ dto) throws Exception {
        return ResponseDto.ofSuccess("멤버목록 조회에 성공했습니다.", service.readMemberListNotInWorkspace(dto));
    }

    /**
     * updateMember : Member 수정
     * @param dto
     * @return
     * @throws NoSuchElementException
     * @throws Exception
     */
    @PutMapping("/api/v1/member")
    public ResponseDto<?> updateMember(@RequestBody MemberRequestDto.UPDATE dto) throws NoSuchElementException, Exception {
        service.updateMember(dto);

        return ResponseDto.ofSuccess("멤버 수정에 성공했습니다.");
    }

    /**
     * updatePassword : Member 비밀번호 수정
     * @param dto
     * @return
     * @throws NoSuchElementException
     * @throws Exception
     */
    @PutMapping("/api/v1/member/password")
    public ResponseDto<?> updatePassword(@RequestBody MemberRequestDto.PASSWORD dto) throws NoSuchElementException, Exception {
        service.updatePassword(dto);

        return ResponseDto.ofSuccess("멤버 비밀번호 수정에 성공했습니다.");
    }

    /**
     * deleteMember : Member 삭제
     * @return
     * @throws NoSuchElementException
     * @throws Exception
     */
    @DeleteMapping("/api/v1/member")
    public ResponseDto<?> deleteMember() throws NoSuchElementException, Exception {
        service.deleteMember();
        
        return ResponseDto.ofSuccess("멤버 삭제에 성공했습니다.");
    }
}