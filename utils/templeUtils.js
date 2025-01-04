import { fetchSchedules } from "../controllers/scheduleController.js";
import { getTempleData, updateResponse } from "../controllers/templeController.js";
import { saveResponse } from "../controllers/mailResponseController.js";
import sendGreetings from "../mailService/mailServiceForTempleBirthdays.js";
import delay from 'delay';


const getTodayDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
    return `${day}-${month}`;
}

const todayDate = getTodayDate();

const createTemplate = (templeDetails) => {

    const templateJSON = JSON.stringify({
        templeBanner: `${templeDetails.postDetails.mediaURL.replace(/\\/g, '/')}`,
        templeDescription: templeDetails.postDetails.postDescription,
        address: templeDetails.address,
        taxId: templeDetails.taxId,
        phone: templeDetails.phone,
        websiteUrl: templeDetails.websiteUrl,
        facebookUrl: templeDetails.facebookUrl,
        twitterUrl: templeDetails.twitterUrl,
        instagramUrl: templeDetails.instagramUrl,
        paypalQrCode: `${templeDetails.paypalQrCodeURL.replace(/\\/g, '/')}`,
        zelleQrCode: `${templeDetails.zelleQrCodeURL.replace(/\\/g, '/')}`
    });
    const template = JSON.parse(templateJSON);
    return template;
}

const sendAutoMailsFromTemple = async () => {
    try {
        const schedules = await fetchSchedules("automate", "temple");
        if (schedules.length === 0) {
            console.log("Found no automate schedules...");
            return;
        }
        for (const schedule of schedules) {
            const templeData = await getTempleData(schedule.temple, todayDate);
            console.log("fetched auto schedule data...", templeData);
            if (templeData) {
                const template = await createTempleDetailsTemplate(templeData);
                if (templeData.csvData === 0) {
                    console.log(`No users are found with birthday match with today associated temple Id:${templeData._id} `);
                }
                else {
                    const responseArray = [];
                    for (const user of templeData.csvData) {
                        console.log(`found user with  birthday, today, ${user.email} `);
                        const response = await sendGreetings(template, user);
                        response.ref = id;
                        responseArray.push(response);
                        await delay(1000);
                    }
                    const ids = await saveResponse(responseArray);
                    await updateResponse(id, ids);
                }
            }
            else {
                console.log(`No Templa details found with Id: ${schedule.temple}`)
            }
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
    }
}

const sendScheduledMailsFromTemple = async (id) => {
    try {
        const data = await getTempleData(id);
        console.log("temple data: ", data);
        if (data) {
            const template = await createTemplate(data);
            const responseArray = [];
            for (const user of data.csvData) {
                const response = await sendGreetings(template, user);
                response.ref = id;
                responseArray.push(response);
                await delay(1000);
            }
            const ids = await saveResponse(responseArray);
            await updateResponse(id, ids);
        }
        else {
            console.log(`No Templa details found with Id: ${temple}`)
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
    }
}

export { sendScheduledMailsFromTemple, sendAutoMailsFromTemple };