export default function formatDateString(input) {
    // Regular expression to check the format dd-mm
    const dateRegex = /^\d{2}-\d{2}$/;

    // If the string is already in the correct format, return it
    if (dateRegex.test(input)) {
        return input;
    }

    // Regular expression to check for yyyy-mm-dd format
    const dateRegexISO = /^\d{4}-\d{2}-\d{2}$/;

    // If the string is in yyyy-mm-dd format, convert it to dd-mm
    if (dateRegexISO.test(input)) {
        const [year, month, day] = input.split('-');
        return `${day.padStart(2, '0')}-${month.padStart(2, '0')}`;
    }

    // Try to format the string to dd-mm by splitting on common delimiters (-, /, .)
    const parts = input.split(/[-\/.]/);
    if (parts.length >= 2) {
        const [day, month] = parts;

        // Ensure day and month are valid numeric values and within proper ranges
        if (
            day.length === 2 &&
            month.length === 2 &&
            !isNaN(Number(day)) &&
            !isNaN(Number(month)) &&
            Number(day) >= 1 &&
            Number(day) <= 31 &&
            Number(month) >= 1 &&
            Number(month) <= 12
        ) {
            // Return formatted string
            return `${day.padStart(2, "0")}-${month.padStart(2, "0")}`;
        }
    }

    // If input cannot be formatted, return null
    return null;
}
