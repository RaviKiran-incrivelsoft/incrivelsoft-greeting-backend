import axios from 'axios';

const API_KEY = process.env.AISENSY_API_KEY;
const WHATSAPP_API = process.env.WHATSAPP_API;

const sendWhatsappMessage = async (to, mediaUrl, templateParams, templeId) => {
    if (!to || !mediaUrl || !templateParams || !templeId) {
        console.error("Invalid input data for WhatsApp message:", { to, mediaUrl, templateParams, templeId });
        return;
    }

    try {
        const data = {
            apiKey: API_KEY,
            campaignName: templeId,
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
    } catch (error) {
        console.error(`Error in sendWhatsappMessage: ${error.message}`, {
            errorDetails: error.response?.data || error.stack
        });
    }
};

export default sendWhatsappMessage;