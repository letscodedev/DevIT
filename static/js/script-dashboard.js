$(document).ready(function(){
    activeProject();
    var date = new Date();
    var deadline = new Date('6/12/2021');
    var startDate = new Date('01/22/2020')
    var diffTime = Math.abs(date - startDate);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    console.log(yes(diffDays, 100, 1))
    function yes(val, max, min) { return ((val - min) / (max - min))*100; }
    $("#data").append(deadline - date);
    $('#progress').animate({
        'width': diffDays
    }, 'slow')
});

function activeProject() {
    $("#data").empty();
    console.log("Active Project");
    var link = 'https://api.myjson.com/bins/126pnc';
    $.getJSON(link, function (yo) {
        // YO should be Array of Posts
        // console.log(yo.data[0])
        // var appendContent = "";
        // $.each(yo['data'], function (index, value) {
        //     var innerData = '';
        //     innerData += '<div class="project-box"><div class="project-box-header" style="display:flex; justify-content: space-between;"><span> Project # ' + parseInt(index+1) + ' </span><span><i class="far fa-clock"></i> ' + value.startDate + ' </span> </div><h1> ' + value.projectTitle + ' </h1><div class="project-box-buttons" style="display:flex; ">';
        //     var tags = ''
        //     $.each(value.tags, function (index, value) {
        //         tags = '';
        //         tags += '<div class="button"> ' + value.tagDes + ' </div>'
        //     });
        //     innerData += tags;
        //     var diffDays = checkProgrss(value.startDate);
        //     console.log(diffDays);
        //     innerData += '</div><div class="project-box-display" style="display: flex; justify-content: space-between;"><div> ' + value.box1 + '</div><div> ' + value.box2 + '</div><div> ' + value.box3 + '</div></div><div style="position: relative; bottom: 0;"><div id="progress' + index + '" style="background-color: red; height: 10px; border-radius: 0 10px 10px 10px;width: '+diffDays+'%"></div></div></div>';
        //     $('#progress'+parseInt(index+1)).animate({
        //         'width': diffDays
        //     }, 'slow')
        //     appendContent += innerData;
        // });
        // console.log(appendContent);
        // $('#data').append('' + appendContent);
    });
}

function pastProject() {
    $("#data").empty();
    console.log("Past Project");
    $("#data").append("past");
}   

function checkProgrss(dateStart) {
    var date = new Date();
    // var deadline = new Date('6/12/2021');
    var startDate = new Date(dateStart)
    var diffTime = Math.abs(date - startDate);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    // console.log(yes(diffDays, 100, 1))
    function yes(val, max, min) { return ((val - min) / (max - min))*100; }
    return diffDays;
    // $("#data").append(deadline - date);
    // $('#progress').animate({
    //     'width': diffDays
    // }, 'slow')
}