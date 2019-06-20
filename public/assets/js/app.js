$(document).ready(function() {
  //click comment button then open modal related to article id
  $(".commentButton").on("click", function(e) {
    e.preventDefault();
    const idd = this.id;
    $(`#modal-${idd}`).modal("show");
    $(".saveComment").attr("id", idd);
    $(".commentContent").empty();
    getComments(idd);
  });

  //save comment to database
  $(".saveComment").on("click", function(e) {
    e.preventDefault();
    const idd = this.id;

    $.ajax({
      method: "POST",
      url: `comment/${idd}`,
      data: {
        name: $(`#nameInput-${idd}`).val(),
        comment: $(`#commentInput-${idd}`).val()
      }
    }).then(function(data) {
      //empty fields
      $(`#nameInput-${idd}`).val("");
      $(`#commentInput-${idd}`).val("");
      //empty comments div
      $(".commentContent").empty();
      //add all comments including new one
      getComments(idd);
    });
  });

  //this needs work on backend for now
  $(".removeLink").on("click", function(e) {
    e.preventDefault();
    const idd = this.id;
    console.log(idd);
    console.log("hi");
  });

  //front end validation for comment form
  $(".ui.form").form({
    fields: {
      name: {
        identifier: "name",
        rules: [
          {
            type: "empty",
            prompt: "Please enter your name"
          }
        ]
      },
      comment: {
        identifier: "comment",
        rules: [
          {
            type: "empty",
            prompt: "Please enter a comment"
          }
        ]
      }
    }
  });
});

//anoter check for validation
const checkRequired = () => {
  if ($(".required").val() !== "") {
    return true;
  }
};

//function retrieves comments and places them in appropriate element
const getComments = id => {
  $.ajax({ method: "GET", url: `comment/${id}` }).then(data => {
    data.forEach(element => {
      $(".commentContent").append(
        `<a class="author" style="color:white;">${element.name}</a>
      <div class="text" style="color:white;">
        ${element.comment}
      </div>
      <div class="actions">
        <a id="${element.id}" href="/delete/${id}/${
          element.id
        }" class="remove removeLink" style="color:red;">Delete</a>
      </div><hr>`
      );
    });
  });
};

/* const newCommentDiv = ""; */
