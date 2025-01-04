import axios from 'axios';

const API_KEY = process.env.AISENSY_API_KEY;
const WHATSAPP_API = process.env.WHATSAPP_API;

const sendWhatsappMessage = async (to, mediaUrl, templateParams, campaignName) => {
    if (!to || !mediaUrl || !templateParams || !campaignName) {
        console.error("Invalid input data for WhatsApp message:", { to, mediaUrl, templateParams, campaignName });
        return;
    }

    try {
        const data = {
            apiKey: API_KEY,
            campaignName: campaignName,
            destination: to,
            userName: 'Incrivelsoft Private Limited',
            templateParams: templateParams,
            source: 'new-landing-page form',
            media: {
                url: mediaUrl,
                filename: mediaUrl.split('/').pop() || 'default_media'
            }
        };

        const configAxios = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post(`${WHATSAPP_API}`, data, configAxios);
        console.log('Message sent successfully:', response.data);
        return {success: true, contact: to};
    } catch (error) {
        console.error(`Error in sendWhatsappMessage: ${error.message}`, {
            errorDetails: error.response?.data || error.stack
        });
        return {sucess: false, contact: to}
    }
};

export default sendWhatsappMessage;