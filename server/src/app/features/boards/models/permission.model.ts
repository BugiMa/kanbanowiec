import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, ColumnType } from "typeorm";
import { UserModel } from "../../users/models/user.model";
import { BoardModel } from "./board.model";
import { UserPermission } from "./UserPermission.enum";

interface PermissionModelProps {
  id: string;
  type: UserPermission;
  user: UserModel;
  board: BoardModel;
}

@Entity({
  name: "permission",
})
export class PermissionModel {
  public static create(data: Partial<PermissionModelProps>): PermissionModel {
    const entity = new PermissionModel();
    Object.assign(entity, data);
    return entity;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: UserPermission })
  type: UserPermission;

  @ManyToOne((type) => UserModel)
  @JoinColumn()
  user: UserModel;

  @ManyToOne((type) => BoardModel)
  @JoinColumn()
  board: BoardModel;
}