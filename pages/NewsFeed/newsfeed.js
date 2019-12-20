let likeCounts;
let feeds = [];

//Load all Newsfeed Items
try {
  feedRef.on("child_added", snapshot => {
    feeds.push(snapshot.val());
    $(".feed-loading").css("display", "none");
    $("#feed-items").prepend(createHtmlItem(snapshot.val(), snapshot.key));
    if (snapshot.val().isLiked) {
      $("#unlike-" + snapshot.key).css("display", "none");
      $("#liked-" + snapshot.key).css("display", "block");
    } else {
      $("#unlike-" + snapshot.key).css("display", "block");
      $("#liked-" + snapshot.key).css("display", "none");
    }
    if (snapshot.val().isFavourite) {
      $("#unstar-" + snapshot.key).css("display", "none");
      $("#starred-" + snapshot.key).css("display", "block");
    } else {
      $("#unstar-" + snapshot.key).css("display", "block");
      $("#starred-" + snapshot.key).css("display", "none");
    }
  });
} catch (error) {
  console.log(error);
}

function likeItem(key) {
  let updLikes;
  let updatedVal = {};
  let isLiked, likes;

  dbRef
    .ref("/newsFeed/" + key)
    .once("value")
    .then(snap => {
      isLiked = snap.val().isLiked;
      likes = snap.val().likes;

      if (!isLiked) {
        $("#unlike-" + key).css("display", "none");
        $("#liked-" + key).css("display", "block");

        updLikes = parseInt(likes) + 1;
        console.log(updLikes);
        updatedVal["newsFeed/" + key + "/likes"] = updLikes;
        updatedVal["newsFeed/" + key + "/isLiked"] = true;
      } else {
        $("#unlike-" + key).css("display", "block");
        $("#liked-" + key).css("display", "none");

        updLikes = parseInt(likes) - 1;
        console.log(updLikes);
        updatedVal["newsFeed/" + key + "/likes"] = updLikes;
        updatedVal["newsFeed/" + key + "/isLiked"] = false;
      }

      let success = firebase
        .database()
        .ref()
        .update(updatedVal);

      $(`#likes-${key}`).html(updLikes);
    });
}

function favItem(key) {
  let updatedVal = {};
  let isFav;

  dbRef
    .ref("/newsFeed/" + key)
    .once("value")
    .then(snap => {
      isFav = snap.val().isFavourite;

      if (!isFav) {
        $("#unstar-" + key).css("display", "none");
        $("#starred-" + key).css("display", "block");

        console.log(isFav);
        updatedVal["newsFeed/" + key + "/isFavourite"] = true;
      } else {
        $("#unstar-" + key).css("display", "block");
        $("#starred-" + key).css("display", "none");

        console.log(isFav);
        updatedVal["newsFeed/" + key + "/isFavourite"] = false;
      }

      let success = firebase
        .database()
        .ref()
        .update(updatedVal);
    });
}

function createHtmlItem(snap, id) {
  let html = "";
  let date = new Date(snap.createdAt);
  let refinedDate =
    date.getDate() +
    "/" +
    (parseInt(date.getMonth()) + 1) +
    "/" +
    date.getFullYear();
  let refinedTime = date.getHours() + ":" + date.getMinutes();

  html += `<div id=${id} class="feed">`;
  html += '<div class="head">';
  html += '<div class="img-container">';
  html += `<img class="avatar-img" src="${snap.authorImg}" />`;
  html += "</div>";
  html += '<div class="name-date">';
  html += '<p class="full-name">' + snap.author + "</p>";
  html += '<p class="date-time">' + refinedDate + " at " + refinedTime + "</p>";
  html += "</div>";
  html += "</div>";

  html += '<div class="post-img">';
  html += "<img src=" + snap.imageUrl + " />";
  html += "</div>";
  html += '<div class="body-cont">';
  html += '<div class="caption-cont">';
  html += '<p class="caption">' + snap.description + "</p>";
  html += "</div>";
  html += '<div class="location-cont">';
  html += '<p class="location">';
  html +=
    '<img src="/assets/icons/map-pin.svg" /> ' +
    snap.district +
    ", " +
    snap.landmark +
    "</p>";
  html += "</div>";
  html += "</div>";
  html += "<hr />";

  html += '<div class="buttons">';
  html += '<div class="like-btn-cont">';
  html += `<button class="like-btn" data-role="none" onClick="likeItem('${id}')">`;
  html +=
    "<img id=unlike-" +
    id +
    ' class="unlike" src="/assets/icons/thumbs-up.svg" />';
  html +=
    "<img id=liked-" +
    id +
    ' class="liked" src="/assets/icons/Active/thumbs-up.svg" />';
  html += "</button>";
  html += "</div>";
  html += '<div class="like-count-cont">';
  html += `<p id=likes-${id} class="like-count">${snap.likes}</p>`;
  html += "</div>";
  html += '<div class="comment-btn-cont">';
  html += '<button class="comment-btn" data-role="none">';
  html += '<img class="comment" src="/assets/icons/message-circle.svg" />';
  html += "</button>";
  html += "</div>";
  html += '<div class="fav-btn-cont">';
  html += `<button class="fav-btn" data-role="none" style="float: right;" onClick="favItem('${id}')">`;
  html += `<img id="unstar-${id}" class="unstar" src="/assets/icons/heart.svg" />`;
  html += `<img id="starred-${id}" class="starred" src="/assets/icons/Active/heart.svg" />`;
  html += "</button>";
  html += "</div>";
  html += "</div>";
  html += "</div>";
  return html;
}
