export default function formatDateString(input) {
    // Regular expression to check the format dd-mm
    const dateRegex = /^\d{2}-\d{2}$/;

    // If the string is already in the correct format, return it
    if (dateRegex.test(input)) {
        return input;
    }

    // Try to format the string to dd-mm
    const parts = input.split(/[-\/.]/); // Split on -, /, or .
    if (parts.length >= 2) {
        const [day, month] = parts;

        // Ensure day and month are valid numbers
        if (
            day.length === 2 &&
            month.length === 2 &&
            !isNaN(Number(day)) &&
            !isNaN(Number(month))
        ) {
            return `${day.padStart(2, "0")}-${month.padStart(2, "0")}`;
        }
    }

    // If input cannot be formatted, throw an error or return null

    return null;
}

