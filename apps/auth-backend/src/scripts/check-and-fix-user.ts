
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Tenant } from "../entity/Tenant";
import * as bcrypt from "bcryptjs";

const initialize = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connected");

        const targetEmail = "nuwanb@swivelgroup.com.au";
        const targetTenant = "swivel";
        const newPassword = "Ok4Me2Bhr!";

        const tenantRepo = AppDataSource.getRepository(Tenant);
        const userRepo = AppDataSource.getRepository(User);

        const tenant = await tenantRepo.findOne({ where: { name: targetTenant } });

        if (!tenant) {
            console.error(`ERROR: Tenant '${targetTenant}' not found.`);
            return;
        }

        console.log(`Found tenant '${targetTenant}' with ID: ${tenant.id}`);

        const user = await userRepo.findOne({ where: { email: targetEmail, tenantId: tenant.id } });

        if (!user) {
            console.error(`ERROR: User '${targetEmail}' not found for tenant '${targetTenant}'.`);
            return;
        }

        console.log(`Found user '${targetEmail}' with ID: ${user.id}`);
        console.log(`Current password_hash: ${user.password_hash}`);

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password_hash = hashedPassword;
        
        await userRepo.save(user); // Save updated user
        console.log(`SUCCESS: Password updated for user '${targetEmail}'.`);
        
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await AppDataSource.destroy();
    }
};

initialize();
