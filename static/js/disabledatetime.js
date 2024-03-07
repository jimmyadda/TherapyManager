function formatDate(datestr)
{
    var date = new Date(datestr);
    var day = date.getDate(); 
    day = day>9?day:"0"+day;
    var month = date.getMonth()+1; month = month>9?month:"0"+month;
    return date.getFullYear()+"-"+month+"-"+day;
}

function pad(n)
{
  return n<10 ? '0'+n : n
}

function changearrformat(arr){

    arr.forEach(function(part, index) {
        arr[index] = part.split(':')[0].replace(' ',':');
      });
      return arr;

}