function getDayOfTheWeek(dateString) {

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    

    var day = days[new Date(dateString).getDay()];
    

    return day;

}

function weekAndDay() {

    var date = new Date,
     
        prefixes = ['1', '2', '3', '4', '5'];

    return prefixes[0 | date.getDate() / 7] ;

}

