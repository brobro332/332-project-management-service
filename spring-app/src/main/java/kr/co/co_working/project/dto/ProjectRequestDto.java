package kr.co.co_working.project.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class ProjectRequestDto {
    @Getter
    @Setter
    public static class CREATE {
        private String name;
        private String description;
        private Long workspaceId;
    }

    @Getter
    @Setter
    public static class READ {
        private Long workspaceId;

        public READ(Long workspaceId) {
            this.workspaceId = workspaceId;
        }
    }

    @Getter
    @Setter
    public static class UPDATE {
        private String name;
        private String description;
        private Long workspaceId;

        @Builder
        public UPDATE(String name, String description, Long workspaceId) {
            this.name = name;
            this.description = description;
            this.workspaceId = workspaceId;
        }
    }
}