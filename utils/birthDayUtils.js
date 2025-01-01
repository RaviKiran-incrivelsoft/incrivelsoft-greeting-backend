import { fetchSchedules } from "../controllers/scheduleController.js";
import { getBirthDayData, updateResponse } from "../controllers/birthDayController.js";
import { saveResponse } from "../controllers/mailResponseController.js";
import sendGreetings from "../mailService/mailServiceForBirthDay.js";
import getTodayDate from "./getTodayDate.js";
import delay from 'delay';

const todayDate = getTodayDate();

const createTemplate = (details) => {

    const templateJSON = JSON.stringify({
        banner: `${details.postDetails.mediaURL.replace(/\\/g, '/')}`,
        description: details.postDetails.postDescription,
        from: details.from,
        title: details.title
    });
    const template = JSON.parse(templateJSON);
    return template;
}

const sendAutoMailsFromBirthDay = async () => {
    try {
        const schedules = await fetchSchedules("automate", "birthday");
        if (schedules.length === 0) {
            console.log("Found no automate schedules...");
            return;
        }
        for (const schedule of schedules) {
            const data = await getBirthDayData(schedule.birthday, todayDate);
            console.log("fetched auto schedule data...", data);
            if (data) {
                const template = await createTemplate(data);
                if (data.csvData === 0) {
                    console.log(`No users are found with birthday match with today associated birthdayDetails schema Id:${data._id} `);
                }
                else {
                    for (const user of data.csvData) {
                        console.log(`found user with  birthday, today, ${user.email} `);
                        await sendGreetings(template, user);
                    }
                }
            }
            else {
                console.log(`No Templa details found with Id: ${schedule.birthday}`)
            }
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
    }
}

const sendScheduledMailsFromBirthDay = async (id) => {
    try {
        const data = await getBirthDayData(id);
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
            console.log(`No BirthDay details found with Id: ${id}`)
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
    }
}

export {sendScheduledMailsFromBirthDay, sendAutoMailsFromBirthDay};