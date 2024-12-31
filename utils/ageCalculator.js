export default function calculateAge(birthdate) {
    // Split the dd-mm-yyyy format into day, month, and year
    const [day, month, year] = birthdate.split('-').map(Number);

    // Create a Date object for the birthdate
    const birthDate = new Date(year, month - 1, day);

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
