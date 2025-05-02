package kr.co.co_working.project.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import kr.co.co_working.project.dto.ProjectRequestDto;
import kr.co.co_working.project.dto.ProjectResponseDto;
import kr.co.co_working.project.dto.QProjectResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static kr.co.co_working.project.QProject.project;

@Repository
@RequiredArgsConstructor
public class ProjectDslRepositoryImpl implements ProjectDslRepository {
    private final JPAQueryFactory factory;

    @Override
    public List<ProjectResponseDto> readProjectList(ProjectRequestDto.READ dto) {
        return factory
                .select(new QProjectResponseDto(project.id, project.name, project.description, project.createdAt, project.modifiedAt))
                .from(project)
                .where(workspaceIdEq(dto.getWorkspaceId()))
                .fetch();
    }

    private BooleanExpression workspaceIdEq(Long workspaceIdCond) {
        return workspaceIdCond != null ? project.workspace.id.eq(workspaceIdCond) : null;
    }
}
