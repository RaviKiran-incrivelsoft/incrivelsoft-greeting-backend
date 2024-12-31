const getTodayDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
    return `${day}-${month}`;
}

export default getTodayDate;