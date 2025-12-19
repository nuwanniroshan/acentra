export class PipelineStatusDTO {
  id: string;
  value: string;
  label: string;
  order: number;

  constructor(status: any) {
    this.id = status.id;
    this.value = status.value;
    this.label = status.label;
    this.order = status.order;
  }
}