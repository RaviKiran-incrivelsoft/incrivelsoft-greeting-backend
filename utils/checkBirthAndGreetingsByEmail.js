import { fetchSchedules } from "../controllers/scheduleController.js";
import { getTempleData } from "../controllers/templeController.js";
import sendGreetings from "../mailService/mailServiceForBirthdays.js"

const BASE_URL = process.env.BASE_URL;
const templeImage = "uploads/santaImage.png";

const getTodayDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
    return `${day}-${month}`;
}

const todayDate = getTodayDate();

const createTempleDetailsTemplate = (templeDetails) => {

    const templateJSON = JSON.stringify({
        templeBanner: `${templeDetails.campaign.mediaURL.replace(/\\/g, '/')}`,
        templeImage: `${BASE_URL}/${templeImage.replace(/\\/g, '/')}`,
        templeDescription: templeDetails.templeDescription,
        address: templeDetails.address,
        taxId: templeDetails.taxId,
        phone: templeDetails.phone,
        fax: templeDetails.fax,
        websiteUrl: templeDetails.websiteUrl,
        facebookUrl: templeDetails.facebookUrl,
        twitterUrl: templeDetails.twitterUrl,
        instagramUrl: templeDetails.instagramUrl,
        paypalQrCode: `${templeDetails.paypalQrCodeURL.replace(/\\/g, '/')}`,
        zelleQrCode: `${templeDetails.zelleQrCodeURL.replace(/\\/g, '/')}`
    });
    console.log("templateJSON: , ", templateJSON)

    // Parses the JSON object to create a proper JavaScript object
    const template = JSON.parse(templateJSON);

}

const sendMails = async () => {
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
                const template = await createTempleDetailsTemplate(templeData);
                if(templeData.csvUser === 0)
                {
                    console.log(`No users are found with birthday match with today associated temple Id:${templeData._id} `);
                }
                else{
                    for( const user of templeData.csvUser )
                        {
                            console.log(`found user with  birthday, today, ${user.email} `);
                            await sendGreetings(templeData, user);
                        }
                }
            }
            else{
                console.log(`No Templa details found with Id: ${schedule.temple}`)
            }
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
    }
} 

export default sendMails;