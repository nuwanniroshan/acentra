export class CandidateAiOverviewDTO {
  id: string;
  overviewText: string;
  structuredData: any;
  createdAt: Date;

  constructor(overview: {
    id: string;
    overviewText: string;
    structuredData: any;
    createdAt: Date;
  }) {
    this.id = overview.id;
    this.overviewText = overview.overviewText;
    this.structuredData = overview.structuredData;
    this.createdAt = overview.createdAt;
  }
}