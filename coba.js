const add = require("date-fns/add");
const { format, add } = require("date-fns");

// const result = add(new Date(), {days: 1,})

const date = format(new Date(add(new Date(), {days: 1,})), 'yyyy-MM-dd hh:mm:ss ' + '+0700')

console.log(date)