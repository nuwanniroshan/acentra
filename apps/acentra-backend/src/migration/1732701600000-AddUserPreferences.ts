import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUserPreferences1732701600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "preferences",
        type: "jsonb",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user", "preferences");
  }
}