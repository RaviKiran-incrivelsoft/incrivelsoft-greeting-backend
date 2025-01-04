import { getFestivalData, updateResponse } from "../controllers/festivalController.js";
import { saveResponse } from "../controllers/mailResponseController.js";
import sendGreetings from "../mailService/mailServiceForFestival.js";
import sendWhatsappMessage from "../whatsappService/whatsappServiceForBirthdays.js";
import delay from 'delay';

const createTemplate = (details) => {

    const templateJSON = JSON.stringify({
        banner: `${details?.postDetails?.mediaURL.replace(/\\/g, '/')}`,
        description: details?.postDetails?.postDescription,
        from: details.from,
        address: details.address,
        title: details.festivalName,
        date: details.festivalDate
    });
    const template = JSON.parse(templateJSON);
    return template;
}

const createTemplateParams = (details, userDetails) => [
    String(userDetails?.first_name || ''),
    String(userDetails?.last_name || ''),
    String(details?.address || 'SIYA RAM'),
    String(details?.from || '123-mnty'),
];


const sendScheduledMailsFromFestival = async (id) => {
    try {
        const data = await getFestivalData(id);
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


const sendScheduledMsgFromFestival = async (id) => {
    try {
        const data = await getFestivalData(id);
        if (!data) {
            console.log(`No Festival details found with Id: ${id}`);
            return;
        }

        const { postDetails: { mediaURL }, csvData } = data;

        const responseArray = [];
        for (const user of csvData) {
            const template = createTemplateParams(data, user);
            console.log("Sending Festival message to", user.contact);
            const response = await sendWhatsappMessage(user.contact, mediaURL, template, "Pongal Greetings");
            response.ref = id;
            responseArray.push(response);
            await delay(1000);
        }
        const ids = await saveResponse(responseArray);
        await updateResponse(id, ids);
    } catch (error) {
        console.error("Error in sendScheduledMsgFromFestival:", error);
    }
};

export { sendScheduledMailsFromFestival, sendScheduledMsgFromFestival };