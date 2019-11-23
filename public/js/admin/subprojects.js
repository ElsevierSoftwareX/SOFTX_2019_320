var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
var projectId = document.querySelector('meta[name="projectId"]').getAttribute('content');

// Vue table.
var vueTable = new Vue({
  el: "#content",
  data: {
    subProjects: [],
    projectUsers: [],
    user: {},
    subProject: {},
    projectId: projectId,
    options: {
      rowClassCallback: function(row) {
        return row._id;
      } 
    }
  },
  methods: {
    findItem(id) {
      for (var sp of this.subProjects) {
        if (sp._id === id) {
          this.subProject = sp;
          break;
        }
      }
    },
  }
});

const openUpdateModal = (id) => {
  vueTable.findItem(id);
  $('#updateModal').modal('show');
};

const update = () => {
  if (vueTable.subProject.supervisor) vueTable.subProject.supervisor = vueTable.subProject.supervisor._id;
  vueTable.subProject.teamLeaders.forEach(el => {
    el = el._id;
  });
  vueTable.subProject.users.forEach(el => {
    el = el._id;
  });
  fetch("/rest/admin/subproject/" + vueTable.subProject._id, {
      headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken
      },
      method: "PUT",
      body: JSON.stringify(vueTable.subProject)
  })
  .then(response => {
    document.getElementById('closeUpdateModal').click();
    if (response.status === 200) {
        response.json().then(data => {
          vueTable.subProject = data.subProject;
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

const openDeleteModal = (id) => {
  vueTable.findItem(id);
  $('#deleteModal').modal('show');
};


const deleteEntry = () => {
  var index = vueTable.subProjects.indexOf(vueTable.subProject);
  var subProjectId = vueTable.subProject._id;
  fetch("/rest/admin/subproject/" + subProjectId, {
    method: "DELETE",
    headers: {
    'Content-Type': 'application/json',
    'csrf-token': csrfToken
    }
  }).then(result => {
    document.getElementById("closeDeleteModal").click();
    if (result.status === 204) {
        vueTable.subProjects.splice(index, 1);
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
    fetch('/vue-tables/admin/' + projectId + '/subprojects')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
      vueTable.projectUsers = data.projectUsers;
      vueTable.subProjects = data.subProjects;
    });
};

// Create row selection option for content table.
$("#content table tbody").on('click', 'tr', function(){
    if ( $(this).hasClass('selected') ) {
        $(this).removeClass('selected');
    } else {
        $("#content table tbody tr.selected").removeClass('selected');
        $(this).addClass('selected');
    }
});