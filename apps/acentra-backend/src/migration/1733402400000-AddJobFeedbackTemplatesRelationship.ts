import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJobFeedbackTemplatesRelationship1733402400000 implements MigrationInterface {
    name = 'AddJobFeedbackTemplatesRelationship1733402400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the table exists, if not create it
        const tableExists = await queryRunner.hasTable('job_feedback_templates');
        if (!tableExists) {
            await queryRunner.createTable(
                new (await import("typeorm")).Table({
                    name: "job_feedback_templates",
                    columns: [
                        {
                            name: "job_id",
                            type: "uuid",
                            isPrimary: true,
                        },
                        {
                            name: "feedback_template_id",
                            type: "uuid",
                            isPrimary: true,
                        },
                    ],
                    foreignKeys: [
                        {
                            name: "FK_job_feedback_templates_job",
                            columnNames: ["job_id"],
                            referencedTableName: "job",
                            referencedColumnNames: ["id"],
                            onDelete: "CASCADE",
                        },
                        {
                            name: "FK_job_feedback_templates_template",
                            columnNames: ["feedback_template_id"],
                            referencedTableName: "feedback_template",
                            referencedColumnNames: ["id"],
                            onDelete: "CASCADE",
                        },
                    ],
                    uniques: [
                        {
                            name: "UQ_job_feedback_template",
                            columnNames: ["job_id", "feedback_template_id"],
                        },
                    ],
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('job_feedback_templates');
    }
}