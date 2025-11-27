import express from 'express';
import { deleteClick, getClickById, getCLickByPUbId, getClicks, trackClick, updateClick } from '../controllers/clickcontroller.js';
const router = express.Router();

router.get('/', trackClick);
router.get("/getAll", getClicks);            // READ all
router.get("/getOne/:id", getClickById);      // READ one
router.get("/getClickPubId/:id", getCLickByPUbId);      // READ one
router.put("/update/:id", updateClick);       // UPDATE
router.delete("/delete/:id", deleteClick);    // DELETE

export default router;
