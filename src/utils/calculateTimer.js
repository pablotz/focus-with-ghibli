export default (minutes) => {
    // The min time will be 10 minutes
    // 10 - 10 minutes
    // 11 - 11 minutes
    // 12 - ...
    let date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    console.log(date)
    return date;
}

