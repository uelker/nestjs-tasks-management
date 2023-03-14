import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { FetchTasksQueryDto } from './dto/fetch-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  fetchAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async fetchTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with id '${id}' does not exist`);
    }

    return found;
  }

  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    return this.taskRepository.save({
      title,
      description,
      status: TaskStatus.OPEN,
      createdAt: new Date(),
    });
  }

  async deleteTaskById(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id '${id}' does not exist`);
    }
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<void> {
    const result = await this.taskRepository.update(id, updateTaskDto);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id '${id}' does not exist`);
    }
  }

  async fetchTasksWithFilter({ status, search }: FetchTasksQueryDto) {
    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }
}
