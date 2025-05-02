package kr.co.co_working.project.service;

import kr.co.co_working.member.dto.MemberRequestDto;
import kr.co.co_working.member.service.MemberService;
import kr.co.co_working.project.dto.ProjectRequestDto;
import kr.co.co_working.project.dto.ProjectResponseDto;
import kr.co.co_working.project.repository.ProjectRepository;
import kr.co.co_working.project.Project;
import kr.co.co_working.workspace.dto.WorkspaceRequestDto;
import kr.co.co_working.workspace.service.WorkspaceService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ProjectServiceTest {
    @Autowired
    ProjectService service;

    @Autowired
    WorkspaceService workspaceService;

    @Autowired
    MemberService memberService;

    @Autowired
    ProjectRepository repository;

    @BeforeEach
    void setUp() {
        String email = "test@korea.kr";
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
            email, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);

        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void createProject() throws Exception {
        /* given */
        MemberRequestDto.CREATE memberDto = getCreateMemberDto();
        memberService.createMember(memberDto);

        WorkspaceRequestDto.CREATE teamDto = getCreateTeamDto(memberDto);
        Long teamId = workspaceService.createWorkspace(teamDto);

        ProjectRequestDto.CREATE projectDto = getCreateProjectDto(teamId);

        /* when */
        Long projectId = service.createProject(projectDto);

        /* then */
        Project project = repository.findById(projectId).get();
        Assertions.assertEquals("프로젝트 A", project.getName());
        Assertions.assertEquals("프로젝트 관리 프로그램 만들기", project.getDescription());
        Assertions.assertEquals(0, project.getTasks().size());
    }

    @Test
    public void readProjectList() throws Exception {
        /* given */
        MemberRequestDto.CREATE memberDto = getCreateMemberDto();
        memberService.createMember(memberDto);

        WorkspaceRequestDto.CREATE teamDto = getCreateTeamDto(memberDto);
        Long teamId = workspaceService.createWorkspace(teamDto);

        ProjectRequestDto.CREATE projectDto = getCreateProjectDto(teamId);
        service.createProject(projectDto);

        /* when */
        List<ProjectResponseDto> projects = service.readProjectList(new ProjectRequestDto.READ(teamId));

        /* then */
        Assertions.assertEquals(1, projects.size());
    }

    @Test
    public void updateProject() throws Exception {
        /* given */
        MemberRequestDto.CREATE memberDto = getCreateMemberDto();
        memberService.createMember(memberDto);

        WorkspaceRequestDto.CREATE teamDto = getCreateTeamDto(memberDto);
        Long teamId = workspaceService.createWorkspace(teamDto);

        ProjectRequestDto.CREATE projectDto = getCreateProjectDto(teamId);
        Long projectId = service.createProject(projectDto);
        Project project = repository.findById(projectId).get();

        /* when */
        service.updateProject(projectId, new ProjectRequestDto.UPDATE("프로젝트 B", "명세 수정", teamId));

        /* then */
        Assertions.assertEquals("프로젝트 B", project.getName());
        Assertions.assertEquals("명세 수정", project.getDescription());
        Assertions.assertEquals(0, project.getTasks().size());
    }

    @Test
    public void deleteProject() throws Exception {
        /* given */
        MemberRequestDto.CREATE memberDto = getCreateMemberDto();
        memberService.createMember(memberDto);

        WorkspaceRequestDto.CREATE teamDto = getCreateTeamDto(memberDto);
        Long teamId = workspaceService.createWorkspace(teamDto);

        List<Long> idList = new ArrayList<>();

        for (int i = 1; i <= 2; i++) {
            ProjectRequestDto.CREATE dto = new ProjectRequestDto.CREATE();
            dto.setName("프로젝트 " + i);
            dto.setDescription("프로젝트 관리 프로그램 만들기 " + i);
            dto.setWorkspaceId(teamId);
            idList.add(service.createProject(dto));
            dto = null;
        }

        /* when */
        repository.delete(repository.findById(idList.get(0)).get());

        /* then */
        Project project = repository.findById(idList.get(1)).get();
        Assertions.assertEquals("프로젝트 2", project.getName());
        Assertions.assertEquals("프로젝트 관리 프로그램 만들기 2", project.getDescription());
        Assertions.assertEquals(1, repository.findAll().size());
    }

    /**
     * getCreateMemberDto : Member DTO 생성
     * @return
     */
    private static MemberRequestDto.CREATE getCreateMemberDto() {
        MemberRequestDto.CREATE memberDto = new MemberRequestDto.CREATE();
        memberDto.setEmail("test@korea.kr");
        memberDto.setPassword("1234");
        memberDto.setName("김아무개");
        memberDto.setDescription("test");
        return memberDto;
    }

    /**
     * getCreateTeamDto : Team DTO 생성
     * @param memberDto
     * @return
     */
    private static WorkspaceRequestDto.CREATE getCreateTeamDto(MemberRequestDto.CREATE memberDto) {
        WorkspaceRequestDto.CREATE teamDto = new WorkspaceRequestDto.CREATE();
        teamDto.setName("팀명 1");
        teamDto.setDescription("팀 소개입니다.");
        return teamDto;
    }

    /**
     * getCreateProjectDto : Project DTO 생성
     * @param teamId
     * @return
     */
    private static ProjectRequestDto.CREATE getCreateProjectDto(Long teamId) {
        ProjectRequestDto.CREATE projectDto = new ProjectRequestDto.CREATE();
        projectDto.setName("프로젝트 A");
        projectDto.setDescription("프로젝트 관리 프로그램 만들기");
        projectDto.setWorkspaceId(teamId);
        return projectDto;
    }
}