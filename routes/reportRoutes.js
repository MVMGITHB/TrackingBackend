import express from 'express';
import { getCampaignReport ,getCampaignByPubIdReport, getAffiliateReportByDate,getCampaignBySubIdReport,getDailyStats,
  getLast10DaysStats,} from '../controllers/campaignReportController.js';


const router = express.Router();

router.get('/campaigns', getCampaignReport);
router.get('/publicerReport', getCampaignByPubIdReport);
router.get('/publicerSubIdReport', getCampaignBySubIdReport);
router.get("/affiliate", getAffiliateReportByDate);
router.get("/daily", getDailyStats);
router.get("/last10days", getLast10DaysStats);

export default router;
