import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { createSpyObj } from 'jest-createspyobj';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepositoryMock: jest.Mocked<Repository<Task>>;

  beforeEach(async () => {
    taskRepositoryMock = createSpyObj(Repository<Task>);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: taskRepositoryMock },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAllTasks()', () => {
    it('should fetch all tasks', () => {
      service.fetchAllTasks();

      expect(taskRepositoryMock.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchTaskById()', () => {
    it('should fetch task by id', () => {
      taskRepositoryMock.findOneBy.mockResolvedValueOnce({
        id: 'uuid',
      } as Task);

      service.fetchTaskById('uuid');

      expect(taskRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: 'uuid' });
    });

    it('should throw an error if task not found', async () => {
      taskRepositoryMock.findOneBy.mockResolvedValueOnce(undefined);

      try {
        await service.fetchTaskById('uuid');
        fail('Exception not thrown');
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual("Task with id 'uuid' does not exist");
      }
    });
  });

  describe('createTask()', () => {
    it('should create a task', () => {
      service.createTask({
        title: 'title',
        description: 'description',
      });

      expect(taskRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.save).toHaveBeenCalledWith({
        title: 'title',
        description: 'description',
        status: TaskStatus.OPEN,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('deleteTaskById()', () => {
    it('should delete task by id', () => {
      taskRepositoryMock.delete.mockResolvedValueOnce({
        affected: 1,
      } as DeleteResult);

      service.deleteTaskById('uuid');

      expect(taskRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.delete).toHaveBeenCalledWith('uuid');
    });

    it('should throw an error if task not found', async () => {
      taskRepositoryMock.delete.mockResolvedValueOnce({
        affected: 0,
      } as DeleteResult);

      try {
        await service.deleteTaskById('uuid');
        fail('Exception not thrown');
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual("Task with id 'uuid' does not exist");
      }
    });
  });

  describe('updateTask()', () => {
    it('should update task by id', () => {
      taskRepositoryMock.update.mockResolvedValueOnce({
        affected: 1,
      } as UpdateResult);

      service.updateTask('uuid', {
        status: TaskStatus.IN_PROGRESS,
      });

      expect(taskRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.update).toHaveBeenCalledWith('uuid', {
        status: TaskStatus.IN_PROGRESS,
      });
    });

    it('should throw an error if task not found', async () => {
      taskRepositoryMock.update.mockResolvedValueOnce({
        affected: 0,
      } as UpdateResult);

      try {
        await service.updateTask('uuid', {
          status: TaskStatus.IN_PROGRESS,
        });
        fail('Exception not thrown');
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual("Task with id 'uuid' does not exist");
      }
    });
  });

  describe('fetchTasksWithFilter()', () => {
    it('should fetch tasks with status filter', () => {
      const queryBuilderMock = { andWhere: jest.fn(), getMany: jest.fn() };
      taskRepositoryMock.createQueryBuilder.mockReturnValueOnce(
        queryBuilderMock as any,
      );

      service.fetchTasksWithFilter({
        status: TaskStatus.IN_PROGRESS,
      });

      expect(taskRepositoryMock.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
        'task',
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'task.status = :status',
        { status: 'IN_PROGRESS' },
      );
      expect(queryBuilderMock.getMany).toHaveBeenCalledTimes(1);
    });

    it('should fetch tasks with search filter', () => {
      const queryBuilderMock = { andWhere: jest.fn(), getMany: jest.fn() };
      taskRepositoryMock.createQueryBuilder.mockReturnValueOnce(
        queryBuilderMock as any,
      );

      service.fetchTasksWithFilter({
        search: 'abc',
      });

      expect(taskRepositoryMock.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
        'task',
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: '%abc%' },
      );
      expect(queryBuilderMock.getMany).toHaveBeenCalledTimes(1);
    });
  });
});
