//create firebase database reference
let dbRef = firebase.database();
let faviouritesRef = dbRef.ref("newsFeed");

//Favourite Item Array
let favItems = [];

//load and sync faviourite items
try {
  faviouritesRef.on("child_added", function(snapshot) {
    $(".fav-item-loading").css("display", "none");
    if (snapshot.val().isFavourite) {
      favItems.push(snapshot.val());
    }
    createList(favItems);
  });
} catch (error) {
  console.log(error);
}

function createList(listItems) {
  document.getElementById("fav-items").innerHTML = "";
  for (let i = 0; i < listItems.length; i++) {
    $("#fav-items").append(contactHtmlFromObject(listItems[i]));
  }
}

function contactHtmlFromObject(snap) {
  let distance = 103;
  let html = "";
  html += '<div class="fav-item">';
  html += '<p class="distance-txt">' + distance + "km Away</p>";
  //   html += "<span>km Away</span>";
  html += '<div class="location">';
  html += '<p class="district">' + snap.district + "</p>";
  html += '<p class="place">' + snap.landmark + "</p>";
  html += "</div>";

  html += '<p class="user-owner">';
  html +=
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-camera">';
  html +=
    '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z">';
  html += "</path>";
  html += '<circle cx="12" cy="13" r="4"></circle>';
  html += "</svg> ";
  html += "&nbsp;" + snap.author + "</p>";
  html += "</div>";
  return html;
}

//Filter data
$(document).on("input", "#distance-range", function() {
  let elemArr = document.getElementsByClassName("fav-item");

  for (let i = 0; i < elemArr.length; i++) {
    if (parseInt(elemArr[i].firstElementChild.textContent) >= $(this).val()) {
      elemArr[i].style.display = "none";
    } else {
      elemArr[i].style.display = "block";
    }
  }
});

$(document).on("change", "#sort-by", e => {
  //Sort By Value
  let index = e.target.options.selectedIndex;
  let sortValue = e.target.options[index].value;

  let orderValue = document.getElementById("order-by").value;

  favItems.sort((a, b) => {
    if (a[sortValue] < b[sortValue]) return -1;
    if (a[sortValue] > b[sortValue]) return 1;
    return 0;
  });

  //By default sort() sots in ascending order
  if (orderValue === "desc") favItems.reverse();
  createList(favItems);
});

$(document).on("change", "#order-by", e => {
  let index = e.target.options.selectedIndex;
  let orderValue = e.target.options[index].value;

  let sortValue = document.getElementById("sort-by").value;
  console.log(sortValue);

  favItems.sort((a, b) => {
    if (a[sortValue] < b[sortValue]) return -1;
    if (a[sortValue] > b[sortValue]) return 1;
    return 0;
  });

  //By default sort() sots in ascending order
  if (orderValue === "desc") favItems.reverse();
  createList(favItems);
});