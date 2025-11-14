import express from 'express';
import { getCampaignReport ,getCampaignByPubIdReport, getAffiliateReportByDate,getCampaignBySubIdReport,getDailyStats,
  getLast10DaysStats,getDailyStatspubId,
  getLast10DaysStatspubId,getConversionReport} from '../controllers/campaignReportController.js';


const router = express.Router();

router.get('/campaigns', getCampaignReport);
router.get('/publicerReport', getCampaignByPubIdReport);
router.get('/publicerSubIdReport', getCampaignBySubIdReport);
router.get("/affiliate", getAffiliateReportByDate);
router.get("/daily", getDailyStats);
router.get("/last10days", getLast10DaysStats);
router.get("/dailypubId/:pubId", getDailyStatspubId);
router.get("/last10dayspubId/:pubId", getLast10DaysStatspubId);
router.get("/conversions", getConversionReport);

export default router;
