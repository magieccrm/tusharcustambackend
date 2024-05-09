const Lead = require("../models/leadModel");
const FollowupLead=require("../models/followupModel");
const csv = require("csvtojson");
const leadattechment=require('../models/leadattechmentModel');


 
const ExcelUplode = async (req, res) => {
  try {
    const { assign_to_agent } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    } 
    const leadData = await csv().fromFile(req.file.path); 
      // Extract unique contact_no values from the uploaded CSV data
    const uniqueContactNos = [...new Set(leadData.map(entry => entry.contact_no))];

    // Query the database to find existing leads with matching contact_no values
    const existingLeads = await Lead.find({ contact_no: { $in: uniqueContactNos } });

    // Filter out contact_no values that already exist in the database
    const uniqueNewContactNos = uniqueContactNos.filter(contactNo => !existingLeads.some(lead => lead.contact_no === contactNo));

    // Prepare new leads data for insertion
    const newLeadsData = leadData.filter(entry => uniqueNewContactNos.includes(entry.contact_no)).map(entry => {
      let description = '';
    
      if (entry?.discussion_with_client) {
        description += entry.discussion_with_client;
      }
    
      if (entry?.InterestedIn) {
        description += (description ? ', ' : '') + entry.InterestedIn;
      }
    
      if (entry?.interested_not_intrested) {
        description += (description ? ', ' : '') + entry.interested_not_intrested;
      }

      return {
        full_name: entry?.full_name, 
        email_id: entry?.email_id,
        contact_no: entry?.contact_no,
        alternative_no: entry?.alternative_no,
        company_name: entry?.company_name,
        position: entry?.position, 
        website: entry?.website,
        lead_cost: entry?.budget,
        full_address: entry?.prefer_location,
        city: entry?.city,
        pincode: entry?.pincode,
        description: description || ' ', // Set to space if description is empty
        max_area: entry?.size,
        type: 'excel',
        assign_to_agent,
        followup_date: new Date(),
      };
    }); 

    // Insert new leads into the database
    const insertedLeads = await Lead.insertMany(newLeadsData);

    // Create follow-up entries for each new lead
    await Promise.all(insertedLeads.map(async (leadd) => {
      const update_data = {
        assign_to_agent: assign_to_agent,
        commented_by: assign_to_agent,
        lead_id: leadd?._id?.toString(),
        followup_date: new Date(),
        followup_desc: leadd?.description 
      }; 
      await FollowupLead.create(update_data);    
    }));

    if (insertedLeads.length > 0) {
      res.status(200).json({
        success: true,
        message: "Uploaded CSV File Successfully",
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: "CSV File is Not Uploaded Successfully",
      });
    }
  } catch (error) { 
    console.error("Error uploading CSV file:", error);
    res.status(500).json({
      success: false,
      message: "File is Not Uploaded Successfully",
    });
  }
};




const FileUplode=async(req,res)=>{
   try {
    var leadData = [];
    const { attechment_name,location,lead_id } =req.body;  
    const file=req.file;
    leadData.push({
      lead_id:lead_id,
      location:location,
      attechment_name:attechment_name,
      leadattechment:file.path,
    })
    await leadattechment.create(leadData);
    res.send({
      status: 200,
      success: true,
      message: "Uploded  File Successfully",
    });
  } catch (error) {
    res.send({ status: 400, success: false, message: "file not Uploded" });
  }
}
module.exports = {
  ExcelUplode,FileUplode
};
