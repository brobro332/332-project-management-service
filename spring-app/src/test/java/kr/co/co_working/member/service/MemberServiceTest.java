package kr.co.co_working.member.service;

import kr.co.co_working.member.Member;
import kr.co.co_working.member.dto.MemberRequestDto;
import kr.co.co_working.member.dto.MemberResponseDto;
import kr.co.co_working.member.repository.MemberRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class MemberServiceTest {
    @Autowired
    MemberService service;
    @Autowired
    MemberRepository repository;
    @Autowired
    PasswordEncoder passwordEncoder;

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
    public void createMember() throws Exception {
        /* given */
        MemberRequestDto.CREATE dto = getCreateDto();

        /* when */
        service.createMember(dto);

        /* then */
        Optional<Member> selectedMember = repository.findById(dto.getEmail());
        Member member = selectedMember.get();

        Assertions.assertEquals("test@korea.kr", member.getEmail());
        Assertions.assertEquals(passwordEncoder.matches("1234", member.getPassword()), true);
        Assertions.assertEquals("김아무개", member.getName());
        Assertions.assertEquals("test", member.getDescription());
    }

    @Test
    public void readMemberList() throws Exception {
        /* given */
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        MemberRequestDto.CREATE createDto = getCreateDto();
        service.createMember(createDto);
        MemberRequestDto.READ readDto = new MemberRequestDto.READ();

        /* when */
        List<MemberResponseDto> members = service.readMemberList(readDto);

        /* then */
        MemberResponseDto member = members.get(0);
        Assertions.assertEquals(1, members.size());
        Assertions.assertEquals("test@korea.kr", member.getEmail());
        Assertions.assertEquals("김아무개", member.getName());
        Assertions.assertEquals("test", member.getDescription());
    }

    @Test
    public void updateMember() throws Exception {
        /* given */
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        MemberRequestDto.CREATE createMemberDto = getCreateDto();
        service.createMember(createMemberDto);

        /* when */
        MemberRequestDto.UPDATE updateDto = MemberRequestDto.UPDATE.builder()
                .name("박아무개")
                .description("수정입니다.")
                .build();

        /* when */
        service.updateMember(updateDto);

        /* then */
        Optional<Member> selectedMember = repository.findById(email);
        Member member = selectedMember.get();

        Assertions.assertEquals("박아무개", member.getName());
        Assertions.assertEquals("수정입니다.", member.getDescription());
    }
    
    @Test
    public void deleteMember() throws Exception {
        /* given */
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        MemberRequestDto.CREATE createDto = getCreateDto();
        service.createMember(createDto);

        /* when */
        service.deleteMember();
        
        /* then */
        MemberRequestDto.READ readDto = new MemberRequestDto.READ();
        List<MemberResponseDto> members = service.readMemberList(readDto);

        Assertions.assertEquals(0, members.size());
    }

    /**
     * getCreateDto : Member CREATE DTO 반환
     * @return
     */
    private static MemberRequestDto.CREATE getCreateDto() {
        MemberRequestDto.CREATE dto = new MemberRequestDto.CREATE();
        dto.setEmail("test@korea.kr");
        dto.setPassword("1234");
        dto.setName("김아무개");
        dto.setDescription("test");

        return dto;
    }
}