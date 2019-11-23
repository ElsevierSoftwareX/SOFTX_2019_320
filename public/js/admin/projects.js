var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
let projectId;

// Vue table for Users.
Vue.use(VueTables.ClientTable);
var vueTable = new Vue({
  el: "#users",
  data: {
    columns: ['email', 'fullname', 'projectsNo'],
    users: [],
    user: {},
    options: {
      skin: "table table-bordered",
      headings: {
        email: 'Email',
        fullname: 'Fullname',
        projectsNo: 'Projects',
      },
      rowClassCallback: function(row) {
        return row._id;
      } 
    }
  },
  methods: {
    updateTableData(data) {
      this.tableData = data;
    },
    findItem(id) {
      for (var u of this.users) {
        if (u._id === id) {
          this.user = u;
          break;
        }
      }
    }
  }
});

/// Project methods.
const openDeleteModal = (id) => {
    projectId = id;
    $('#deleteModal').modal('show');
};
  
const deleteEntry = () => {
    document.getElementById("closeDeleteModal").click();
    fetch('/rest/admin/project/' + projectId, {
        method: "DELETE",
        headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrfToken
        }
    }).then(result => {
        if (result.status === 204) {
            window.location = "/";
        } else {
        result.json().then(data => {
            toastr.error(data.message);
        });
        }
    })
    .catch(err => {
        toastr.error("A problem occured, please try again.");
        console.log(err);
    });
};

//// Users methods
const create = (btn) => {
    const formData = new FormData(btn.closest('form'));
    let formObject = {};
    for (const [key, value]  of formData.entries()) {
        formObject[key] = value;
    }
    if (formObject.password !== formObject.repeatPassword) {
        toastr.error("Passwords don't match.");
        return false;
    }
    fetch("/rest/admin/user", {
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
                vueTable.users = data.users;
            });
        } else {
            response.json().then(data => {
                toastr.error(data.message);
            });
        }
    })
    .catch(err => {
        toastr.error(err);
        console.log(err);
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
  
const update = (btn) => {
fetch("/rest/admin/user/" + vueTable.user._id, {
    headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrfToken
    },
    method: "PUT",
    body: JSON.stringify(vueTable.user)
})
.then(response => {
    btn.previousElementSibling.click();
    if (response.status === 200) {
        response.json().then(data => {
        vueTable.user = data.user;
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

const openDeleteUSerModal = () => {
    let area = document.getElementById("users");
    let row = area.getElementsByClassName('selected');
    if (row.length === 0) {
        alert("You have to select a choice.");
    } else {
        trId = row[0].classList[0];
        vueTable.findItem(trId);
        $('#deleteUserModal').modal('show');
    }
};
  
  
  
const deleteUserEntry = () => {
var index = vueTable.users.indexOf(vueTable.user);
document.getElementById("closeDeleteModal").click();
fetch("/rest/admin/user/" + vueTable.user._id, {
    method: "DELETE",
    headers: {
    'Content-Type': 'application/json',
    'csrf-token': csrfToken
    }
}).then(result => {
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
    console.log(err);
});
};


window.onload = function() {
    // Fetch data for users.
    fetch('/vue-tables/admin/users')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
      vueTable.users = data.users;
    });
};

// Create row selection option for users table.
$("#users table tbody").on('click', 'tr', function(){
    if ( $(this).hasClass('selected') ) {
        $(this).removeClass('selected');
    } else {
        $("#users table tbody tr.selected").removeClass('selected');
        $(this).addClass('selected');
    }
});
