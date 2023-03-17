import moment from 'moment'

export const convertDateFormat = (dateString) => {
    const inputFormat = 'DD/MM/YYYY';
    const outputFormat = 'MMMM Do YYYY';
    const dateObject = moment(dateString, inputFormat);
    const convertedDate = dateObject.format(outputFormat);
    return convertedDate;
}