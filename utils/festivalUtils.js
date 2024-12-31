import { getFestivalData } from "../controllers/festivalController.js";
import sendGreetings from "../mailService/mailServiceForFestival.js"

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


const sendScheduledMailsFromFestival = async (id) => {
    try {
        const data = await getFestivalData(id);
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

export {sendScheduledMailsFromFestival};