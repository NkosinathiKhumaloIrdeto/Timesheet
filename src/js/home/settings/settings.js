var settingsCtr = function ($scope, $http, $state) {

     $scope.linkWorktype  = "";

     $scope.filters = {
         txtFilterCategory : '',
         txtFilterLinks : '',
         txtFiltersubcat : '',
         txtFilterProject : ''
     }

    $scope.objs = {
        worktype: {
            isLoading: true,
            data: [],
            worktypetext: '',
            addWFLink: ''
        },
        category: {
            isLoading: true,
            data: [],
            categorytext: ''
        },
        projectname: {
            isLoading: true,
            data: [],
            projectnametext: ''
        },
        categorylinks: {
            isLoading: true,
            data: []
        },
        isEditing: false,
        form: {
            description: "",
            type: ""
        },
        addWFtype: false,
        addProjectName: false,
        addCategory: false,
        addSubCategory: false

    }

    function loadAll() {
        loadData_worktypey();
        loadData_category();
        loadData_projectname();
        loadData_allLinks();

    }

    loadAll();

    function loadData_allLinks(){
        //
        //get all worktype
        $http.get('/settings/getAllLinkedCats')
            .then((res) => {
                $scope.objs.categorylinks.isLoading = false;

                var lst = _.orderBy(res.data, ['worktype'], ['asc']);

                $scope.objs.categorylinks.data = lst;

            })
    }

    $scope.add_link = (id_category)=>{

        var x = $('#worktype').val()
       
        var worktype_item_index = _.findIndex($scope.objs.worktype.data, function(o) { return o.description == x; });

        var worktype_id = $scope.objs.worktype.data[worktype_item_index].id

        $http.get('/settings/addLinkedCat/'+ worktype_id + "/" + id_category)
            .then((res) => {

                loadAll();

                alert("Linked successfully");


            }, (err)=>{

                alert(err.data.message);

                console.log(err);

            })

    }
 
    function loadData_worktypey() {
        //get all worktype
        $http.get('/settings/getAllWorktype')
            .then((res) => {
                $scope.objs.worktype.isLoading = false;
                $scope.objs.worktype.data = res.data;

                  //modal categories
                  $('#worktype').val('');

                  var options = $("#worktype");
  
                  //don't forget error handling!
                  var lst = _.orderBy(res.data, ['description'], ['asc']); // Use Lodash to sort array by 'name'

                  $.each(lst, function (item) {
                      options.append($("<option />").val(lst[item].description).text(lst[item].description));
                  });

            })
    }

    function loadData_category() {
        //get all category
        $http.get('/settings/getAllCategory')
            .then((res) => {
                $scope.objs.category.isLoading = false;
                $scope.objs.category.data = res.data;
            })
    }

    function loadData_projectname() {
        //get all projectname
        $http.get('/settings/getAllProjectName')
            .then((res) => {
                $scope.objs.projectname.isLoading = false;
                $scope.objs.projectname.data = res.data;

            })
    }

    function clear_form() {
        $scope.objs.form.description = "";

        $scope.objs.form.type = "";
        $scope.objs.worktype.worktypetext = "";
        $scope.objs.category.categorytext = "";
        $scope.objs.projectname.projectnametext = "";

    }

    //========================================== WORKTYPE

    $scope.save_work_type = function () {

        $('#first').css("display", "block");

        $http.post('/settings/addWorkType/' + $scope.objs.worktype.worktypetext, {})
            .then((res) => {

                loadAll();

                $('#first').css("display", "none");

                showSnack(res.data.message);

                clear_form();

                $scope.objs.addWFtype = false;

            })

    }

    $scope.remove_work_type = function (obj) {

        if (!confirm("Are you sure you want to delete this entry?")) {
            return;
        }

        $('#first').css("display", "block");

        $http.post('/settings/removeWorkType/' + obj.id, {})
            .then((res) => {

                loadAll();

                $('#first').css("display", "none");

                showSnack(res.data.message);

                clear_form();

                $scope.objs.addWFtype = false;

            })

    }

    $scope.remove_link = function(link){
        if (!confirm("Are you sure you want to delete this entry?")) {
            return;
        }

        $('#first').css("display", "block");

        $http.post('/settings/removeLink/' + link.id, {})
            .then((res) => {

                loadAll();

                $('#first').css("display", "none");

                showSnack(res.data.message);

                clear_form();

                $scope.objs.addWFtype = false;

            })

    }

    //========================================== WORKTYPE
    //========================================== PRJECT NAME
    $scope.save_project_name = function () {

        $('#first').css("display", "block");

//$scope.objs.worktype.worktypetext, {})
        $http.post('/settings/addProjectName/' + $scope.objs.projectname.projectnametext, {})
            .then((res) => {

                loadAll();

                $('#first').css("display", "none");

                showSnack(res.data.message);

                clear_form();

                $scope.objs.addProjectName = false;
                console.log("done")
            })

    }

    $scope.remove_subCategory = function(obj){

        if (!confirm("Are you sure you want to delete this entry?")) {
            return;
        }

        $http.post('/settings/removeCategory/' + obj.id, {})
        .then((res) => {

            loadAll();

            $('#first').css("display", "none");

            showSnack(res.data.message);

            clear_form();

            $scope.objs.addProjectName = false;

        })

    }

    $scope.remove_project_name = function (obj) {

        console.log(obj)

        if (!confirm("Are you sure you want to delete this entry?")) {
            return;
        }

        $('#first').css("display", "block");
       
        $http.post('/settings/removeProjectName/' + obj.id, {})
            .then((res) => {

                loadAll();

                $('#first').css("display", "none");

                showSnack(res.data.message);

                clear_form();

                $scope.objs.addProjectName = false;

            })

    }
    //========================================== PRJECT NAME
    //========================================== CATEGORY
    $scope.save_category = function () {

        $('#first').css("display", "block");

        $http.post('/settings/addCategory/' + $scope.objs.category.categorytext, {})
            .then((res) => {

                loadAll();

                $('#first').css("display", "none");

                showSnack(res.data.message);

                clear_form();

                $scope.objs.addSubCategory = false;

            })

    }
/*
    $scope.remove_project_name = function (obj) {

        if (!confirm("Are you sure you want to delete this entry?")) {
            return;
        }

        $('#first').css("display", "block");

        $http.post('/settings/removeCategory/' + obj.id, {})
            .then((res) => {

                loadAll();

                $('#first').css("display", "none");

                showSnack(res.data.message);

                clear_form();

                $scope.objs.addCategory = false;

            })

    }
    //========================================== CATEGORY
*/
}