import cron from "node-cron";
import { Op } from "sequelize";
import { SessionsModel } from "../models/sessions";

export const SessionCleanup = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      await SessionsModel.destroy({
        where: {
          createdAt: {
            [Op.lt]: twentyFourHoursAgo,
          },
        },
      });

      console.log("Session cleanup job completed successfully");
    } catch (error) {
      console.error("Error cleaning up sessions:", error);
    }
  });
};
