import sendWhatsappMessage from "../whatsappService/whatsappServiceForBirthdays.js";
import {fetchSchedules} from "../controllers/scheduleController.js"
import getTodayDate from "./getTodayDate.js"

const todayDate = getTodayDate();

const createTemplateParams = (templeDetails) => {
    const templateParams = [
        toString(templeDetails.csvUser.first_name),
        toString(templeDetails.csvUser.last_name),
        toString(templeDetails.templeName || 'SIYA RAM'),  // Correctly access temple details
        toString(templeDetails.address || '123-mnty'),     // Access temple address
        toString(templeDetails.phone || '9876543210'),     // Access temple phone
        toString(templeDetails.websiteUrl || 'http://temp.com'),   // Access temple website
        toString(templeDetails.facebookUrl || 'http://tempfb.com'), // Access temple Facebook
        toString(templeDetails.twitterUrl || 'http://temptt.com'),  // Access temple Twitter
        toString(templeDetails.instagramUrl || 'http://tempinsta.com'), // Access temple Instagram
        toString(templeDetails.campaign.mediaURL) // Ensure this is being converted
      ];
      return templateParams;
}
const sendAutoWhatsappMessagesByBirthday = async() => {
    try {
        const schedules = await fetchSchedules("automate");
        if (schedules.length === 0) {
            console.log("Found no automate schedules...");
            return;
        }
        for (const schedule of schedules) {
            const templeData = await getTempleData(schedule.temple, todayDate);
            console.log("fetched auto schedule data...", templeData);
            if (templeData) {
                if(templeData.csvUser === 0)
                {
                    console.log(`No users are found with birthday match with today associated temple Id:${templeData._id} `);
                }
                else{
                    const mediaURL = templeData.campaign.mediaURL;
                    const campaignName = mediaURL.includes('.mp4') ? 'videoga' : 'imagega';
                    for( const user of templeData.csvUser )
                        {
                            console.log(`found user with  birthday, today, ${user.phone} `);
                            const templateParams = await createTemplateParams(templeData);
                            await sendWhatsappMessage(user.contact, mediaURL, templateParams, campaignName);                            
                        }
                }
            }
            else{
                console.log(`No Templa details found with Id: ${schedule.temple}`)
            }
        }
    } catch (error) {
        console.log("Error in the sendAutoWhatsappMessagesByBirthday...", error);
    }
}

const sendAutoWhatsappMessages = async() => {
    try {
        
    } catch (error) {
        console.log("Error in the ")
    }
}