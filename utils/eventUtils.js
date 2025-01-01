import { getEventData, updateResponse } from "../controllers/eventController.js";
import sendGreetings from "../mailService/mailServiceForEvent.js";
import { saveResponse } from "../controllers/mailResponseController.js";
import delay from 'delay';

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
            console.log(`No Festival details found with Id: ${id}`)
        }

    } catch (error) {
        console.log("Error in the sendMails, ", error);
    }
}

export { sendScheduledMailsFromEvent };