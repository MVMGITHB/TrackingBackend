

import Click from '../models/click.js';
import Affiliate from '../models/affiliateModel.js';
// import Campaign from '../model/campaign.js';
import Compaign from "../models/compaignModel.js";
import { v4 as uuidv4 } from 'uuid';

export const trackClick = async (req, res) => {
  let { campaign_id, pub_id,originalClick,sub1,affiliate_id } = req.query;

  // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  // const ip =req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;


  let ip =
  req.headers["x-forwarded-for"]?.split(",")[0].trim() || 
  req.headers["x-real-ip"] ||
  req.ip || 
  req.socket.remoteAddress;





  const userAgent = req.headers['user-agent'];
  const referrer = req.headers['referer'];


//   console.log("IP DEBUG:", {
//   req_ip: req.ip,
//   x_forwarded_for: req.headers["x-forwarded-for"],
//   x_real_ip: req.headers["x-real-ip"],
//   remote_addr: req.socket.remoteAddress,
// });



  if (campaign_id !== undefined) {
  campaign_id = Number(campaign_id);
  if (isNaN(campaign_id)) {
    return res.status(400).json({ success: false, message: "Invalid compId" });
  }

  const compaign = await Compaign.findOne({compId:campaign_id})

  if(!compaign){
    return res.send("<h1>INVALID_COMPAIGN</h1>")
  }

  if(compaign.status !=='Active'){
     return res.send(`<h1>COMPAIGN is ${compaign.status}</h1>`)
  }

}

  if (pub_id !== undefined) {
       pub_id = Number(pub_id);
  if (isNaN(pub_id)) {
    return res.status(400).json({ success: false, message: "Invalid pub_id" });
  }

  const publicer = await Affiliate.findOne({pubId:pub_id})

  if(!publicer){
    return res.send("<h1>INVALID_PUBLISER</h1>")
  }





const compaign = await Compaign.findOne({ compId: campaign_id });

    if (!compaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    // if campaign is private -> check allowedAffiliates
    if (
      compaign.visibility === "Private" &&
      (!compaign.allowedAffiliates || !compaign.allowedAffiliates.includes(publicer._id))
    ) {
      return res.send("<h1>COMPAIGN_INVALID_ACCESS</h1>")
    }
  
  
}

  try {

     let deviceId = req.cookies.deviceId;
    if (!deviceId) {
      deviceId = uuidv4();
      res.cookie("deviceId", deviceId, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: false,
        secure: true,
        sameSite: "None",
      });
    }


    const existing = await Click.findOne({ campaignId: campaign_id, pubId: pub_id, ip,userAgent,deviceId: deviceId });
    const isUnique = !existing;

    const click = await Click.create({
      campaignId: campaign_id,
      pubId: pub_id,
      clickId: uuidv4(),
      ip,
      userAgent,
      referrer,
      isUnique,
      deviceId:deviceId,
      originalClick:originalClick || affiliate_id,
      sub1:sub1
    });

    // Find campaign and increment click count
    const campaign = await Compaign.findOneAndUpdate(
      { compId: campaign_id },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    // const campaign = await Compaign.findOne({ compId: campaign_id })

    if (!campaign) return res.status(404).send('INVALID_OFFER_ID');

    const publiser = await Affiliate.findOne({pubId:pub_id});

    if(!publiser.pubId) {
      return res.status(404).send('INVALID_PUBLISER_ID');
    }

    // Set cookies
    res.cookie('campaignId', campaign_id, {
      maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false, secure: true, sameSite: 'None'
    });
    res.cookie('pubId', pub_id, {
      maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false, secure: true, sameSite: 'None'
    });
    res.cookie('clickId', click.clickId, {
      maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false, secure: true, sameSite: 'None'
    });

    // Redirect


    /*
    const redirectUri = new URL(campaign.trakingUrl);
    // redirectUri.searchParams.set('click_id', click._id);
    // redirectUri.searchParams.set('campaign_id', campaign_id);
    // redirectUri.searchParams.set('pub_id', pub_id);

    res.redirect(`${redirectUri.toString()}?cid=${click.clickId}&campaignId=${campaign_id}&pubId=${pub_id}`);


    console.log((`${redirectUri.toString()}?cid=${click.clickId}&campaignId=${campaign_id}&pubId=${pub_id}`))

    */



const extraParams = `campaignId=${campaign_id}&pubId=${pub_id}`;

let redirectUri1 = campaign?.trakingUrl?.replace("{click_id}", click.clickId);

if (redirectUri1.includes("https://tracking.ajio.business/click") && redirectUri1.includes("&redirect=")) {
  redirectUri1 = redirectUri1.replace("&redirect=", `&${extraParams}&redirect=`);
}


// console.log("redirectUri1",redirectUri1)

const redirectUri = new URL(redirectUri1);

// Build your extra params


// Check if ? already exists in the base URL
let finalUrl;

if(redirectUri1.includes("https://tracking.ajio.business/click") && redirectUri1.includes("&redirect=")){
    finalUrl= redirectUri
}
else if (redirectUri.search) {
  // URL already has ?
  finalUrl = `${redirectUri.toString()}&${extraParams}`;
  // console.log("for ?",finalUrl)
}else {
  // No query yet
  finalUrl = `${redirectUri.toString()}?${extraParams}`;
  // console.log("for ",finalUrl)
}

// Redirect to final URL
res.redirect(finalUrl);



  } catch (error) {
    console.error('Click tracking error:', error);
    res.status(500).json({ message: 'Click tracking failed', error });
  }
};


