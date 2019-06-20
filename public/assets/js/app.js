$(document).ready(function() {
  $(".commentButton").on("click", function(e) {
    e.preventDefault();
    const idd = this.id;
    $(`#modal-${idd}`).modal("show");
    $(".saveComment").attr("id", idd);
    $(".commentContent").empty();
    getComments(idd);
  });

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
      $(`#nameInput-${idd}`).val("");
      $(`#commentInput-${idd}`).val("");
      $(".commentContent").empty();
      getComments(idd);
    });
  });

  $(".removeLink").on("click", function(e) {
    e.preventDefault();
    const idd = this.id;
    console.log(idd);
    console.log("hi");
  });

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

const checkRequired = () => {
  if ($(".required").val() !== "") {
    return true;
  }
};

const getComments = id => {
  $.ajax({ method: "GET", url: `comment/${id}` }).then(data => {
    /*  console.log(data); */
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
      </div>`
      );
    });
  });
};

const newCommentDiv = "";
