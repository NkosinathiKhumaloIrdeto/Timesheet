var settingsCtr = function ($scope, $http, $state) {

    $scope.objs = {
        worktype: {
            isLoading: true,
            data: []
        },
        category: {
            isLoading: true,
            data: []
        },
        projectname: {
            isLoading: true,
            data: []
        },
        isEditing: false,
        form: {
            description: "",
            type: ""
        }
    }

    function loadAll() {
        loadData_worktypey();
        loadData_category();
        loadData_projectname();

    }

    loadAll();

    function loadData_worktypey() {
        //get all worktype
        $http.get('/settings/getAllSettings/worktype')
            .then((res) => {
                $scope.objs.worktype.isLoading = false;
                $scope.objs.worktype.data = res.data;

            })
    }

    function loadData_category() {
        //get all category
        $http.get('/settings/getAllSettings/category')
            .then((res) => {
                $scope.objs.category.isLoading = false;
                $scope.objs.category.data = res.data;

            })
    }

    function loadData_projectname() {
        //get all projectname
        $http.get('/settings/getAllSettings/projectname')
            .then((res) => {
                $scope.objs.projectname.isLoading = false;
                $scope.objs.projectname.data = res.data;

            })
    }

    function clear_form(){
        $scope.objs.form.description = ""
        $scope.objs.form.type = ""
   
    }

    $scope.action = function (obj, type) {



        switch (type) {
            case "edit":

                break;
            case "remove":

                if (!confirm("Are you sure you want to delete this entry?")) {
                    return;
                }
                $('#first').css("display", "block");
                $http.post('/settings/deleteSetting', { "_id": obj._id })
                    .then((res) => {

                        loadAll();

                        $('#first').css("display", "none");

                        showSnack(res.data.message);

                        clear_form();
                        
                    })

                break;
            case "new":
                $('#first').css("display", "block");
                $http.post('/settings/addSetting', obj)
                    .then((res) => {
                        $scope.objs.isEditing = false;

                        loadAll();

                        $('#first').css("display", "none");

                        showSnack(res.data.message);

                        clear_form();
                    })
                break;
        }



    }


}