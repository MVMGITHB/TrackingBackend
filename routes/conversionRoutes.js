

import express from 'express';
import { handleOfflineReport, handlePostback } from '../controllers/conversionController.js';


import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get('/postback', handlePostback);
router.post("/upload-excel", upload.single("file"), handleOfflineReport);
export default router;
