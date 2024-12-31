import PostDetails from "../models/PostModel.js";

const predefinedTemplates = [
	{
		postName: "Birthday Celebration",
		postDescription: "Celebrate your special day with our exclusive birthday template.",
		mediaURL: "https://cdn.templates.unlayer.com/assets/1676265088672-cake.png",
		type: "birthday",
		isGlobal: true,
	},
	{
		postName: "Anniversary Wishes",
		postDescription: "Wishing you both a lifetime of love, happiness, and cherished memories. May your journey together continue to be filled with joy and affection!",
		mediaURL: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735597028/anniversary_npxxyd.png",
		type: "anniversary",
		isGlobal: true,
	},
	{
		postName: "New Year Greetings",
		postDescription: "As we welcome 2025, let's embrace new opportunities, celebrate friendships, and cherish the memories that shape our lives. Here's to a year of success, happiness, and endless possibilities!",
		mediaURL: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735622347/New_Year__3_-removebg-preview_huihni.png",
		type: "occasion",
		isGlobal: true,
	},
	{
		postName: "Event Announcement",
		postDescription: "Welcome to our special event! Customize this message to include details about the occasion, such as what to expect, activities planned, or any important information. Make it personal and engaging!",
		mediaURL: "https://tlr.stripocdn.email/content/guids/CABINET_b3ad24678cbb4d23876b91c37b9a8eb8/images/inviterafiki_1.png",
		type: "event",
		isGlobal: true,
	},
	// {
	// 	postName: "Festival Greetings",
	// 	postDescription: "Send warm wishes with our beautiful festival template.",
	// 	mediaURL: "https://example.com/festival-template.jpg",
	// 	type: "festival",
	// 	isGlobal: true,
	// },
	{
		postName: "Temple Information",
		postDescription: "Celebrate your special day with our exclusive birthday template",
		mediaURL: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735657868/duyp9meidk3cji7zrqdm.png",
		type: "temple",
		isGlobal: true,
	},
];

const createPredefinedTemplates = async () => {
	try {
		for (const template of predefinedTemplates) {
			const exists = await PostDetails.findOne({ type: template.type, isGlobal: true });
			if (!exists) {
				await PostDetails.create(template);
				console.log(`Template for ${template.type} created.`);
			} else {
				console.log(`Template for ${template.type} already exists.`);
			}
		}
	} catch (error) {
		console.error("Error creating predefined templates:", error);
	}
};

export default createPredefinedTemplates;
