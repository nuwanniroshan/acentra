import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { CandidateScorecard } from "@/entity/CandidateScorecard";
import { Candidate } from "@/entity/Candidate";
import { User } from "@/entity/User";

export class CandidateScorecardController {
  static async list(req: Request, res: Response) {
    const { candidateId } = req.params;
    const scorecardRepository = AppDataSource.getRepository(CandidateScorecard);

    try {
      const scorecards = await scorecardRepository.find({
        where: { candidate: { id: candidateId }, tenantId: req.tenantId },
        relations: ["submitted_by"],
        order: { created_at: "DESC" },
      });
      return res.json(scorecards);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching scorecards", error });
    }
  }

  static async submit(req: Request, res: Response) {
    const { candidateId } = req.params;
    const { criteria, comments, overall_recommendation } = req.body;
    const user = (req as any).user;

    const scorecardRepository = AppDataSource.getRepository(CandidateScorecard);
    const candidateRepository = AppDataSource.getRepository(Candidate);
    const userRepository = AppDataSource.getRepository(User);

    try {
      const candidate = await candidateRepository.findOne({
        where: { id: candidateId, tenantId: req.tenantId },
      });

      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      const dbUser = await userRepository.findOne({ where: { id: user.userId } });

      const scorecard = new CandidateScorecard();
      scorecard.candidate = candidate;
      scorecard.submitted_by = dbUser;
      scorecard.criteria = criteria;
      scorecard.comments = comments;
      scorecard.overall_recommendation = overall_recommendation;
      scorecard.tenantId = req.tenantId;

      await scorecardRepository.save(scorecard);
      return res.status(201).json(scorecard);
    } catch (error) {
      return res.status(500).json({ message: "Error submitting scorecard", error });
    }
  }
}
