var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
var projectId = document.querySelector('meta[name="projectId"]').getAttribute('content');

// Vue table.
Vue.use(VueTables.ClientTable);
var vueTable = new Vue({
  el: "#users",
  data: {
    columns: ['fullname', 'level'],
    systemUsers: [],
    users: [],
    user: {},
    levels: ['S1', 'S2', 'S3', 'S4', 'S5'],
    projectId: projectId,
    options: {
      skin: "table table-bordered",
      headings: {
        fullname: 'Fullname',
        level: 'Level',
        subProject: 'Support-project',
        supervisor: 'Supervisor',
      },
      rowClassCallback: function(row) {
        return row._id;
      } 
    }
  },
  methods: {
    findItem(id) {
      for (var u of this.users) {
        if (u._id === id) {
          this.user = u;
          break;
        }
      }
    },
  }
});

const create = (btn) => {
  const formData = new FormData(btn.closest('form'));
  let formObject = {};
  for (const [key, value]  of formData.entries()) {
      formObject[key] = value;
  }
  
  fetch("/rest/admin/" + projectId, {
      headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken
      },
      method: "POST",
      body: JSON.stringify(formObject)
  })
  .then(response => {
      btn.previousElementSibling.click();
      if (response.status === 201) {
      response.json().then(data => {
          vueTable.users.push(data.user);
      });
      } else {
        response.json().then(data => {
            toastr.error(data.message);
        });
      }
  })
  .catch(err => {
      toastr.error(err);
  });
};

const openUpdateModal = () => {
  let area = document.getElementById("users");
  let row = area.getElementsByClassName('selected');
  let trId;
  if (row.length === 0) {
    alert("You have to select a choice.");
  } else if (row.length === 1) {
    trId = row[0].classList[0];
    vueTable.findItem(trId);
    $('#updateModal').modal('show');
  } else {
    alert("A problem occured, please try again.");
  }
};

const update = () => {
  var userId = vueTable.user._id;
  var newUserLevel = vueTable.user.projects[projectId].level;
  fetch("/rest/admin/" + projectId + "/" + userId, {
      headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken
      },
      method: "PUT",
      body: JSON.stringify({level: newUserLevel})
  })
  .then(response => {
    document.getElementById('closeUpdateModal').click();
    if (response.status === 200) {
        response.json().then(data => {
          vueTable.user = data.user;
          toastr.success(data.message);
        });
    } else {
        response.json().then(data => {
            toastr.error(data.message);
        });
    }
  })
  .catch(err => {
      toastr.error(err);
  });
};

const openDeleteModal = () => {
  let area = document.getElementById("users");
  let row = area.getElementsByClassName('selected');
  if (row.length === 0) {
      alert("You have to select a choice.");
  } else {
      trId = row[0].classList[0];
      vueTable.findItem(trId);
      $('#deleteModal').modal('show');
  }
};


const deleteEntry = () => {
  var index = vueTable.users.indexOf(vueTable.user);
  var userId = vueTable.user._id;
  fetch("/rest/admin/" + projectId + "/" + userId, {
    method: "DELETE",
    headers: {
    'Content-Type': 'application/json',
    'csrf-token': csrfToken
    }
  }).then(result => {
    document.getElementById("closeDeleteModal").click();
    if (result.status === 204) {
        vueTable.users.splice(index, 1);
    } else {
    result.json().then(data => {
        toastr.error(data.message);
    });
    }
  })
  .catch(err => {
    toastr.error("A problem occured, please try again.");
  });
};

window.onload = function() {
    // Fetch data for users.
    fetch('/vue-tables/admin/' + projectId)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
      vueTable.users = data.users;
      vueTable.systemUsers = data.systemUsers;
    });
};

// Create row selection option for content table.
$("#users table tbody").on('click', 'tr', function(){
    if ( $(this).hasClass('selected') ) {
        $(this).removeClass('selected');
    } else {
        $("#users table tbody tr.selected").removeClass('selected');
        $(this).addClass('selected');
    }
});