import axios from 'axios';

const API_KEY = process.env.AISENSY_API_KEY;
const WHATSAPP_API = process.env.WHATSAPP_API;

const sendWhatsappMessage = async (to, mediaUrl, templateParams, templeId) => {
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
                filename: 'sample_media'
            },
            buttons: [],
            carouselCards: [],
            location: {},
            paramsFallbackValue: {
                FirstName: 'user'
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
        console.log("Error in the sendWhatsappMessage, ", error);
    }
}

export default sendWhatsappMessage;