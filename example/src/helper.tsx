import { Task } from "../../dist/types/PublicTypes";

export function initTasks() {
  const tasks: any[] = [
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "sadfsadfsadfasdfasf",
      id: "ProjectSample",
      progress: 50,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "Idea",
      id: "Task 0",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "Research",
      id: "Task 1",
      progress: -10,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 2",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 31",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 3",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 4",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 5",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 6",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 7",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 8",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 9",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 10",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 11",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 12",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 13",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 14",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 15",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 16",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 17",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 18",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 19",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 20",
      progress: 155,
      type: "task",
      project: "ProjectSample",
    },
    {
      start: new Date("2020-05-01"),
      end: new Date("2020-05-02"),
      name: "aaaa",
      id: "Task 21",
      progress: 155,
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
