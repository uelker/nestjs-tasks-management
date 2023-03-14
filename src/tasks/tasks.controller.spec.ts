import { Test, TestingModule } from '@nestjs/testing';
import { createSpyObj } from 'jest-createspyobj';
import { TaskStatus } from './task-status.enum';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksServiceMock: jest.Mocked<TasksService>;

  beforeEach(async () => {
    tasksServiceMock = createSpyObj(TasksService);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: tasksServiceMock }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('fetchTasks()', () => {
    it('should fetch tasks', () => {
      controller.fetchTasks();

      expect(tasksServiceMock.fetchAllTasks).toHaveBeenCalledTimes(1);
    });

    it('should fetch tasks with filter', () => {
      controller.fetchTasks({ search: 'abc' });

      expect(tasksServiceMock.fetchTasksWithFilter).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.fetchTasksWithFilter).toHaveBeenCalledWith({
        search: 'abc',
      });
    });
  });

  describe('fetchTaskById()', () => {
    it('should fetch task by id', () => {
      controller.fetchTaskById('uuid');

      expect(tasksServiceMock.fetchTaskById).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.fetchTaskById).toHaveBeenCalledWith('uuid');
    });
  });

  describe('createTask()', () => {
    it('should create a task', () => {
      controller.createTask({
        title: 'title',
        description: 'description',
      });

      expect(tasksServiceMock.createTask).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.createTask).toHaveBeenCalledWith({
        title: 'title',
        description: 'description',
      });
    });
  });

  describe('updateTask()', () => {
    it('should update a task', () => {
      controller.updateTask('uuid', {
        status: TaskStatus.IN_PROGRESS,
      });

      expect(tasksServiceMock.updateTask).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.updateTask).toHaveBeenCalledWith('uuid', {
        status: TaskStatus.IN_PROGRESS,
      });
    });
  });

  describe('deleteTask()', () => {
    it('should delete a task', () => {
      controller.deleteTask('uuid');

      expect(tasksServiceMock.deleteTaskById).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.deleteTaskById).toHaveBeenCalledWith('uuid');
    });
  });
});
