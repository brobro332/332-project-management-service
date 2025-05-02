package kr.co.co_working.member.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description = "멤버 요청 DTO")
public class MemberRequestDto {
    @Getter
    @Setter
    @Schema(description = "멤버 등록 요청 DTO")
    public static class CREATE {
        @Schema(description = "멤버 이메일")
        private String email;
        
        @Schema(description = "멤버 비밀번호")
        private String password;
        
        @Schema(description = "멤버 이름")
        private String name;
        
        @Schema(description = "멤버 명세")
        private String description;
    }

    @Getter
    @Setter
    public static class READ {
        private String email;
        private String name;
        private Long workspaceId;
    }

    @NoArgsConstructor
    @Getter
    @Setter
    public static class UPDATE {
        private String name;
        private String description;

        @Builder
        public UPDATE(String name, String description) {
            this.name = name;
            this.description = description;
        }
    }

    @NoArgsConstructor
    @Getter
    @Setter
    public static class PASSWORD {
        private String password;
    }
}