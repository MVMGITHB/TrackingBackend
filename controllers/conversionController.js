import Conversion from '../models/conversionModel.js';
import Click from '../models/click.js';
import Affiliate from '../models/affiliateModel.js';
import fetch from 'node-fetch';
import Compaign from "../models/compaignModel.js";

import xlsx from "xlsx";
import fs from "fs";

export const handlePostback = async (req, res) => {
  const { click_id} = req.query;
       

   const amount = req.query.amount && !isNaN(req.query.amount) 
  ? Number(req.query.amount) 
  : 0;

  try {
    // 1. Find click
    const click = await Click.findOne({ clickId: click_id });
    if (!click) {
      return res.status(404).json({ message: 'Click not found' });
    }

    const presentClick = await Conversion.findOne({clickId:click_id});

    if(presentClick){
       return res.status(404).json({ message: 'Conversion already present' });
    }

    // 2. Save conversion
    await Conversion.create({
      clickId: click_id,
      campaignId: click.campaignId,
      pubId: click.pubId,
      amount: amount || 0
    });



     // 3. Update campaign stats
    const campaign = await Compaign.findOne({ compId: click.campaignId }); // compId from your schema
    if (campaign) {
      const updatedConversions = campaign.conversions + 1;
      const updatedSaleAmount = campaign.saleAmount + amount;
      const updatedCR = campaign.clicks > 0 ? (updatedConversions / campaign.clicks) * 100 : 0;

      await Compaign.updateOne(
        { compId: click.campaignId },
        {
          $inc: {
            conversions: 1,
            saleAmount: amount
          },
          $set: {
            conversionRate: updatedCR
          }
        }
      );
    }


    // 4. Find affiliate postback URL
    const affiliate = await Affiliate.findOne({ pubId: click.pubId });
    if (!affiliate || !affiliate.postBackUrl) {
      console.warn(`No postback URL for pubId ${click.pubId}`);
    } else {
      const finalUrl = affiliate.postBackUrl
        .replace('{click_id}', click.originalClick)
        .replace('{payout}', amount || 3);

      // 4. Fire postback to Panel C
      fetch(finalUrl)
        .then(() => console.log(`Fired postback to: ${finalUrl}`))
        .catch((err) =>
          console.error(`Postback failed: ${finalUrl}`, err.message)
        );
    }

    res.status(200).json({ message: 'Conversion tracked and postback fired' });
  } catch (error) {
    console.error('Postback error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



export const handleOfflineReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 📄 Read Excel file
    const workbook = xlsx.readFile(req.file.path);

    

    const sheetName = workbook.SheetNames[0];

    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 🗑 Delete file after reading
    fs.unlinkSync(req.file.path);

 

    let processed = 0;
    let skipped = 0;

    for (const row of data) {
      const clickId = row.clickId || row.ClickId;
      const amount = Number(row.amount || row.Amount || 0);

      if (!clickId) {
        skipped++;
        continue;
      }

      const click = await Click.findOne({ clickId });
      if (!click) {
        skipped++;
        continue;
      }

      const presentClick = await Conversion.findOne({ clickId });
      if (presentClick) {
        skipped++;
        continue;
      }

      // ✅ Save new conversion
      await Conversion.create({
        clickId,
        campaignId: click.campaignId,
        pubId: click.pubId,
        amount,
      });

      // ✅ Update campaign stats
      const campaign = await Compaign.findOne({ compId: click.campaignId });
      if (campaign) {
        const updatedConversions = campaign.conversions + 1;
        const updatedSaleAmount = campaign.saleAmount + amount;
        const updatedCR =
          campaign.clicks > 0 ? (updatedConversions / campaign.clicks) * 100 : 0;

        await Compaign.updateOne(
          { compId: click.campaignId },
          {
            $inc: {
              conversions: 1,
              saleAmount: amount,
            },
            $set: {
              conversionRate: updatedCR,
            },
          }
        );
      }

      // ✅ Fire postback to affiliate
      const affiliate = await Affiliate.findOne({ pubId: click.pubId });
      if (affiliate?.postBackUrl) {
        const finalUrl = affiliate.postBackUrl
          .replace("{click_id}", click.originalClick)
          .replace("{payout}", amount || 3);

        fetch(finalUrl)
          .then(() => console.log(`✅ Postback fired: ${finalUrl}`))
          .catch((err) =>
            console.error(`❌ Postback failed: ${finalUrl}`, err.message)
          );
      }

      processed++;
    }

    res.json({
      message: "Offline report processed",
      processed,
      skipped,
    });
  } catch (error) {
    console.error("Offline report error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
