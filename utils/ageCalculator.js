export default function calculateAge(birthdate) {
    // Function to parse different date formats
    const parseDate = (dateStr) => {
        // Check if the format is 'YYYY-mm-dd'
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split('-').map(Number);
            return new Date(year, month - 1, day);
        }

        // Check if the format is 'dd-mm-yyyy'
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
            const [day, month, year] = dateStr.split('-').map(Number);
            return new Date(year, month - 1, day);
        }

        // Check if the format is 'mm/dd/yyyy'
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
            const [month, day, year] = dateStr.split('/').map(Number);
            return new Date(year, month - 1, day);
        }

        // Throw an error for unsupported formats
        throw new Error("Unsupported date format. Please use 'YYYY-mm-dd', 'dd-mm-yyyy', or 'mm/dd/yyyy'.");
    };

    // Parse the birthdate
    const birthDate = parseDate(birthdate);

    // Get the current date
    const currentDate = new Date();

    // Calculate the age
    let age = currentDate.getFullYear() - birthDate.getFullYear();

    // Adjust if the current date is before the birthdate in the current year
    const isBeforeBirthdayThisYear =
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate());

    if (isBeforeBirthdayThisYear) {
        age--;
    }

    return age;
}
