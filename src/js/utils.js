function getDayOfTheWeek(dateString) {

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var day = days[new Date(dateString).getDay()];
    //var month = months[now.getMonth()];

    return day;

}

function weekAndDay() {

    var date = new Date,
     
        prefixes = ['1', '2', '3', '4', '5'];

    return prefixes[0 | date.getDate() / 7] ;

}

