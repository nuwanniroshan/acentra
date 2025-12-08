import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { Department } from "@/entity/Department";
import { DepartmentListDTO } from "@/dto/DepartmentListDTO";

export class DepartmentController {
  static async list(req: Request, res: Response) {
    const departmentRepository = AppDataSource.getRepository(Department);
    const departments = await departmentRepository.find({
      where: { tenantId: req.tenantId },
      select: ["id", "name"]
    });

    const departmentDTOs = departments.map(dept => new DepartmentListDTO(dept));
    return res.json(departmentDTOs);
  }

  static async create(req: Request, res: Response) {
    const { name } = req.body;
    const departmentRepository = AppDataSource.getRepository(Department);
    const department = new Department();
    department.name = name;
    department.tenantId = req.tenantId;
    await departmentRepository.save(department);
    return res.status(201).json(department);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const departmentRepository = AppDataSource.getRepository(Department);
    const department = await departmentRepository.findOne({ where: { id: id as string, tenantId: req.tenantId } });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    await departmentRepository.remove(department);
    return res.status(204).send();
  }
}
