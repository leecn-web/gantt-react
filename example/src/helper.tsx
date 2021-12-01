import { Task } from "../../dist/types/PublicTypes";

export function initTasks() {
  const tasks: any[] = [
    {
      start: new Date("2022-02-12 00:00:00"),
      end: new Date("2022-02-14 00:00:00"),
      name: "Some Project",
      id: "ProjectSample",
      progress: 25,
      type: "task",
      hideChildren: false,
    },
    {
      start: new Date(),
      end: new Date(),
      name: "Idea",
      id: "Task 0",
      progress: "",
      type: "task",
      project: "ProjectSample",
      isEmpty: true,
    },
    {
      start: new Date("2022-01-12 00:00:00"),
      end: new Date("2022-01-14 00:00:00"),
      name: "Research",
      id: "Task 1",
      progress: 25,
      type: "task",
      project: "ProjectSample",
    },
  ];
  return tasks;
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}
