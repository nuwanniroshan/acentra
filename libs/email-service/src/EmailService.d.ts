export declare class EmailService {
    private static transporter;
    static sendEmail(to: string, subject: string, text: string): Promise<void>;
    static sendPasswordResetEmail(email: string, token: string): Promise<void>;
    static notifyJobAssignment(email: string, jobTitle: string, jobDescription: string, startDate: Date, expectedClosingDate: Date): Promise<void>;
    static notifyJobPendingApproval(email: string, jobTitle: string, creatorName: string): Promise<void>;
    static notifyJobApproved(email: string, jobTitle: string, budget?: number): Promise<void>;
    static notifyJobRejected(email: string, jobTitle: string, reason: string): Promise<void>;
    static notifyCandidateUpload(email: string, candidateName: string, jobTitle: string): Promise<void>;
    static notifyStatusChange(email: string, candidateName: string, newStatus: string, jobTitle: string): Promise<void>;
    static sendDemoRequestEmail(data: {
        name: string;
        email: string;
        phone: string;
        meetingTime?: string;
    }): Promise<void>;
}
