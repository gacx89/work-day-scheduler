var tasks = [];

var displayCurrentDay = function() {
  // Display current date in '(DAY_OF_WEEK), (MONTH) (DAY_OF_MONTH)' format
  $("#currentDay").text(moment().format("dddd, MMMM Do"));
};

var auditTask = function () { 
  // Update colors of timeblocks based on time
  $(".hour > p").each(function(){
    var time;
    time = moment().format("YYYY-MM-DD " + $(this).attr("data-time"));

    if (moment().isAfter(time,"hour")) {
      $(this).parent().siblings(".time-block").removeClass("present future");
      $(this).parent().siblings(".time-block").addClass("past");
    } else if (moment().isSame(time,"hour")) {
      $(this).parent().siblings(".time-block").removeClass("past future");
      $(this).parent().siblings(".time-block").addClass("present");
    } else {
      $(this).parent().siblings(".time-block").removeClass("present past");
      $(this).parent().siblings(".time-block").addClass("future");
    }  
  });
};

$(".time-block").on("click", function () {
  // get current text
  var description = $(this).find(".description")
    .text()
    .trim();
  
  var tempID = $(this).find(".description").attr("id");

  // create new input element
  var descInput = $("<textarea>")
    .val(description)
    .attr("data-tempid",tempID);

  // swap out elements
  $(this).find(".description").replaceWith(descInput);

  $(this).addClass("edit-mode");

  descInput.trigger("focus");
});

$(".time-block").on("blur", "textarea", function () {
  // get the textarea's current value/text
  var text = $(this)
    .val()
    .trim();

  var tempID = $(this).attr("data-tempid");
  // recreate p element
  var taskP = $("<p>")
    .addClass("description w-100 h-100")
    .attr("id",tempID)
    .text(text);

  $(this).parent(".time-block").removeClass("edit-mode");

  // replace textarea with p element
  $(this).replaceWith(taskP);

});

$(".saveBtn").on("click", function() {
  
  var timeBlock = $(this).attr("data-time");
  var desc = $("#"+timeBlock+"P").text();
  tasks.push({time: timeBlock, description: desc});
  saveTasks();

});

var saveTasks = function () {
  // Save tasks to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function () {
  // Load tasks from local storage
  tasks = JSON.parse(localStorage.getItem("tasks"));

  if (!tasks) {
    tasks = [];
  }

  for (var i = 0; i < tasks.length; i++){
    $("#" + tasks[i].time + "P").text(tasks[i].description);
  }
};

setInterval(function () {
  // Periodically update display of current day and colors of timeblocks
  displayCurrentDay;
  auditTask;
}, 60000);

displayCurrentDay();
loadTasks();
auditTask();
