package kr.co.co_working.project;

import jakarta.persistence.*;
import kr.co.co_working.common.CommonTime;
import kr.co.co_working.milestone.Milestone;
import kr.co.co_working.task.Task;
import kr.co.co_working.workspace.Workspace;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "tbl_project")
public class Project extends CommonTime {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "project_id")
    private Long id;

    @Column(name = "project_name", nullable = false, length = 20)
    private String name;

    @Column(name = "project_description", length = 200)
    private String description;

    @OneToMany(mappedBy = "project", cascade = CascadeType.REMOVE)
    private List<Task> tasks = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.REMOVE)
    private List<Milestone> milestones = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @Builder
    public Project(String name, String description, Workspace workspace) {
        this.name = name;
        this.description = description;
        this.workspace = workspace;
    }

    public void updateProject(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void insertTask(Task task) {
        this.tasks.add(task);
        task.updateTask(task.getName(), task.getType(), task.getDescription(), this, task.getStartAt(), task.getEndAt());
    }

    public void deleteTask(Task task) {
        this.tasks.remove(task);
    }
}