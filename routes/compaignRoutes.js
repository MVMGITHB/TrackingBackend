import express from "express";
import {
  createCompaign,
  getAllCompaigns,
  getCompaignById,
  updateCompaign,
  deleteCompaign,
  getAllCompaigns1,
  updateAllowedAffiliates 
} from "../controllers/compaignController.js";

const router = express.Router();

router.post("/creteCompaign", createCompaign);
router.get("/getALLCompaign", getAllCompaigns);
router.get("/getALLCompaigns", getAllCompaigns1);
router.get("/getOneCompaign/:id", getCompaignById);
router.patch("/updateCompaign/:id", updateCompaign);
router.delete("/deleteCompaign/:id", deleteCompaign);
router.patch("/allowed-affiliates/:id", updateAllowedAffiliates);


export default router;
