


// import Compaign from "../models/compaignModel.js";

// // Create Compaign
// export const createCompaign = async (req, res) => {
//   try {
     
//     const {offerName,status,devices,startDate,endDate,type,trakingUrl, payout,
//     saleAmount = 0,advertiser} = req.body


//     const newCompaign = new Compaign({
//       offerName,status,devices,startDate,endDate,type,trakingUrl,payout,advertiser,saleAmount,
//       clicks: 0,
//       conversions: 0,
//       extendedConversions: 0,
//       cancelledConversions: 0,
//       pendingConversions: 0,
//       conversionRate: 0,
//     });
//     await newCompaign.save();
//     res.status(201).json({ success: true, data: newCompaign });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get All
// export const getAllCompaigns = async (req, res) => {
//   try {
//     const compaigns = await Compaign.find().populate("advertiser");
//     res.status(200).json({ success: true, data: compaigns });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get One
// export const getCompaignById = async (req, res) => {
//   try {
//     const compaign = await Compaign.findById(req.params.id).populate("advertiser");
//     if (!compaign) return res.status(404).json({ success: false, message: "Compaign not found" });
//     res.status(200).json({ success: true, data: compaign });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Update
// // export const updateCompaign = async (req, res) => {
// //   try {
// //     const compaign = await Compaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
// //     if (!compaign) return res.status(404).json({ success: false, message: "Compaign not found" });
// //     res.status(200).json({ success: true, data: compaign });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };


// export const updateCompaign = async (req, res) => {
//   try {
//     const compaign = await Compaign.findById(req.params.id);
//     if (!compaign) {
//       return res.status(404).json({ success: false, message: "Compaign not found" });
//     }

//     // Update each field only if provided in req.body
//     compaign.offerName = req.body.offerName ?? compaign.offerName;
//     compaign.status = req.body.status ?? compaign.status;
//     compaign.devices = req.body.devices ?? compaign.devices;
//     compaign.startDate = req.body.startDate ?? compaign.startDate;
//     compaign.endDate = req.body.endDate ?? compaign.endDate;
//     compaign.type = req.body.type ?? compaign.type;
//     compaign.trakingUrl = req.body.trakingUrl ?? compaign.trakingUrl;
//     compaign.payout = req.body.payout ?? compaign.payout;
//     compaign.advertiser = req.body.advertiser ?? compaign.advertiser;
//     compaign.compId =  compaign.compId

//     // Stats fields
//     compaign.clicks = req.body.clicks ?? compaign.clicks;
//     compaign.conversions = req.body.conversions ?? compaign.conversions;
//     compaign.saleAmount = req.body.saleAmount ?? compaign.saleAmount;
//     compaign.extendedConversions = req.body.extendedConversions ?? compaign.extendedConversions;
//     compaign.cancelledConversions = req.body.cancelledConversions ?? compaign.cancelledConversions;
//     compaign.pendingConversions = req.body.pendingConversions ?? compaign.pendingConversions;
//     compaign.conversionRate = req.body.conversionRate ?? compaign.conversionRate;

//     const updated = await compaign.save();
//     res.status(200).json({ success: true, data: updated });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



// // Delete
// export const deleteCompaign = async (req, res) => {
//   try {
//     const compaign = await Compaign.findByIdAndDelete(req.params.id);
//     if (!compaign) return res.status(404).json({ success: false, message: "Compaign not found" });
//     res.status(200).json({ success: true, message: "Compaign deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };




import Compaign from "../models/compaignModel.js";

// Create Compaign
export const createCompaign = async (req, res) => {
  try {
    const {
      offerName, status, devices, startDate, endDate, type,
      trakingUrl, payout, advertiser, saleAmount = 0,
      visibility = "Public", allowedAffiliates = []
    } = req.body;

    const newCompaign = new Compaign({
      offerName, status, devices, startDate, endDate, type,
      trakingUrl, payout, advertiser, saleAmount,
      visibility,
      allowedAffiliates,
      clicks: 0,
      conversions: 0,
      extendedConversions: 0,
      cancelledConversions: 0,
      pendingConversions: 0,
      conversionRate: 0,
    });

    await newCompaign.save();
    res.status(201).json({ success: true, data: newCompaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get All
export const getAllCompaigns = async (req, res) => {
  try {
    const compaigns = await Compaign.find().populate("advertiser").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: compaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get One
export const getCompaignById = async (req, res) => {
  try {
    const compaign = await Compaign.findById(req.params.id).populate("advertiser").sort({ createdAt: -1 });
    if (!compaign) return res.status(404).json({ success: false, message: "Compaign not found" });
    res.status(200).json({ success: true, data: compaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update
// export const updateCompaign = async (req, res) => {
//   try {
//     const compaign = await Compaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!compaign) return res.status(404).json({ success: false, message: "Compaign not found" });
//     res.status(200).json({ success: true, data: compaign });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


export const updateCompaign = async (req, res) => {
  try {
    const compaign = await Compaign.findById(req.params.id);
    if (!compaign) {
      return res.status(404).json({ success: false, message: "Compaign not found" });
    }

    // Update each field only if provided in req.body
    compaign.offerName = req.body.offerName ?? compaign.offerName;
    compaign.status = req.body.status ?? compaign.status;
    compaign.devices = req.body.devices ?? compaign.devices;
    compaign.startDate = req.body.startDate ?? compaign.startDate;
    compaign.endDate = req.body.endDate ?? compaign.endDate;
    compaign.type = req.body.type ?? compaign.type;
    compaign.trakingUrl = req.body.trakingUrl ?? compaign.trakingUrl;
    compaign.payout = req.body.payout ?? compaign.payout;
    compaign.advertiser = req.body.advertiser ?? compaign.advertiser;

    // Ensure compId never changes
    compaign.compId = compaign.compId;

    // Visibility fields
    compaign.visibility = req.body.visibility ?? compaign.visibility;

    // If visibility is Private and allowedAffiliates is passed → update
    if (req.body.visibility === "Private") {
      if (Array.isArray(req.body.allowedAffiliates)) {
        compaign.allowedAffiliates = req.body.allowedAffiliates;
      }
    } else if (req.body.visibility === "Public") {
      // Clear allowedAffiliates if switched to Public
      compaign.allowedAffiliates = [];
    }

    // Stats fields
    compaign.clicks = req.body.clicks ?? compaign.clicks;
    compaign.conversions = req.body.conversions ?? compaign.conversions;
    compaign.saleAmount = req.body.saleAmount ?? compaign.saleAmount;
    compaign.extendedConversions = req.body.extendedConversions ?? compaign.extendedConversions;
    compaign.cancelledConversions = req.body.cancelledConversions ?? compaign.cancelledConversions;
    compaign.pendingConversions = req.body.pendingConversions ?? compaign.pendingConversions;
    compaign.conversionRate = req.body.conversionRate ?? compaign.conversionRate;

    const updated = await compaign.save();
    res.status(200).json({ success: true, data: updated });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Delete
export const deleteCompaign = async (req, res) => {
  try {
    const compaign = await Compaign.findByIdAndDelete(req.params.id);
    if (!compaign) return res.status(404).json({ success: false, message: "Compaign not found" });
    res.status(200).json({ success: true, message: "Compaign deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getAllCompaigns1 = async (req, res) => {
  try {
    const { affiliateId } = req.query; // pass affiliateId in query

    let query = { visibility: "Public" };

    if (affiliateId) {
      query = {
        $or: [
          { visibility: "Public" },
          { visibility: "Private", allowedAffiliates: affiliateId }
        ]
      };
    }

   

    const compaigns = await Compaign.find(query).populate("advertiser");


    res.status(200).json({ success: true, data: compaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const updateAllowedAffiliates = async (req, res) => {
  try {
    const { id } = req.params; // campaign id
    const { allowedAffiliates } = req.body; // array of affiliate IDs

    const compaign = await Compaign.findById(id);
    if (!compaign) {
      return res
        .status(404)
        .json({ success: false, message: "Compaign not found" });
    }

    // ✅ Update with provided IDs (even empty array)
    // compaign.allowedAffiliates = Array.isArray(allowedAffiliates)
    //   ? allowedAffiliates
    //   : compaign.allowedAffiliates;

    compaign.allowedAffiliates = allowedAffiliates?allowedAffiliates:[]

   

    const updated = await compaign.save();

    res.status(200).json({
      success: true,
      message: "allowedAffiliates updated successfully",
      data: updated.allowedAffiliates,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message });
  }
};



// export const updateAllowedAffiliates = async (req, res) => {
//   try {
//     const { id } = req.params; // campaign id
//     const { allowedAffiliates } = req.body; // array of affiliate IDs

//     if (!Array.isArray(allowedAffiliates) || allowedAffiliates.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "allowedAffiliates must be a non-empty array of affiliate IDs",
//       });
//     }

//     const compaign = await Compaign.findById(id);
//     if (!compaign) {
//       return res.status(404).json({ success: false, message: "Compaign not found" });
//     }

//     // Add new affiliates only if not already present
//     const existingIds = compaign.allowedAffiliates.map((a) => a.toString());
//     const newIds = allowedAffiliates.filter((id) => !existingIds.includes(id));

//     compaign.allowedAffiliates = [...compaign.allowedAffiliates, ...newIds];

//     // validation: must not be empty if campaign is Private
//     if (compaign.visibility === "Private" && compaign.allowedAffiliates.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "allowedAffiliates must contain at least one Affiliate when visibility is Private",
//       });
//     }

//     const updated = await compaign.save();

//     res.status(200).json({
//       success: true,
//       message: "allowedAffiliates updated successfully",
//       data: updated.allowedAffiliates,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };