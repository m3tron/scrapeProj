//$.get("/scrape").then($.get("/news"));
$(document).ready(function() {
  $(".commentButton").on("click", function(e) {
    e.preventDefault();
    $(".ui.basic.modal").modal("show");
    console.log(this);

    const idd = this.id;
    console.log(idd);
    $(".saveComment").attr("id", idd);
  });

  $(".saveComment").on("click", function(e) {
    e.preventDefault();
    const idd = this.id;
    console.log(`comment/${idd}`);

    $.ajax({
      method: "POST",
      url: `comment/${idd}`,
      data: {
        name: $("#nameInput").val(),
        comment: $("#commentInput").val()
      }
    }).then(function(data) {
      $("#commentInput").val("");
    });
  });
});
