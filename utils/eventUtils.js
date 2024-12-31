import { getEventData } from "../controllers/eventController.js";
import sendGreetings from "../mailService/mailServiceForEvent.js"

const createTemplate = (details) => {

    const templateJSON = JSON.stringify({
        banner: `${details?.postDetails?.mediaURL.replace(/\\/g, '/')}`,
        description: details?.postDetails?.postDescription,
        address: details.address,
        title: details.eventName,
        date: details.eventDate
    });
    const template = JSON.parse(templateJSON);
    return template;
    
}


const sendScheduledMailsFromEvent = async (id) => {
    try {
        const data = await getEventData(id);
        if (data) {
            const template = await createTemplate(data);
            for (const user of data.csvData) {
                await sendGreetings(template, user);
            }
        }
        else {
            console.log(`No Festival details found with Id: ${id}`)
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
    }
}

export {sendScheduledMailsFromEvent};