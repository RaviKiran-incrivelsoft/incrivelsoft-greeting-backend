import { fetchSchedules } from "../controllers/scheduleController.js";
import { getMarriageData } from "../controllers/marriageController.js";
import sendGreetings from "../mailService/mailServiceForMarriage.js"
import getTodayDate from "./getTodayDate.js"

const todayDate = getTodayDate();

const createTemplate = (details) => {

    const templateJSON = JSON.stringify({
        banner: `${details?.postDetails?.mediaURL.replace(/\\/g, '/')}`,
        description: details?.postDetails?.postDescription,
        from: details.from,
        title: details.title
    });
    const template = JSON.parse(templateJSON);
    return template;
}

const sendAutoMailsFromMarriage = async () => {
    try {
        const schedules = await fetchSchedules("automate", "marriage");
        if (schedules.length === 0) {
            console.log("Found no automate schedules...");
            return;
        }
        for (const schedule of schedules) {
            const data = await getMarriageData(schedule.marriage, todayDate);
            console.log("fetched auto schedule data...", data);
            if (data) {
                const template = await createTemplate(data);
                if (data.csvData === 0) {
                    console.log(`No users are found with marriage match with today associated marriageDetails schema Id:${data._id} `);
                }
                else {
                    for (const user of data.csvData) {
                        console.log(`found user with  marriageDay, today, ${user.email} `);
                        await sendGreetings(template, user);
                    }
                }
            }
            else {
                console.log(`No Templa details found with Id: ${schedule.marriage}`)
            }
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
    }
}

const sendScheduledMailsFromMarriageDay = async (id) => {
    try {
        const data = await getMarriageData(id);
        if (data) {
            const template = await createTemplate(data);
            for (const user of data.csvData) {
                await sendGreetings(template, user);
            }
        }
        else {
            console.log(`No Marriage details found with Id: ${id}`)
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
    }
}

export {sendScheduledMailsFromMarriageDay, sendAutoMailsFromMarriage};