angular.module('libraryApp', ['ngResource'])
.constant('baseUrl', (function() {
    
    
    
    var resource =  'http://rest.learncode.academy/api/learncode/';
    return {
        base_dom: resource,
        author_dom: resource + 'library/',
       
    }

})())

.controller('libraryCtrl', function($scope, $http, $resource, baseUrl){
    
    
    
    
    $scope.currentView = 'main'
 
    $scope.authorsResource = $resource(baseUrl.author_dom + ':id', { id: '@id'});
    
    $scope.refresh = function () {
        $scope.library = $scope.authorsResource.query();
    }
    

    
    $scope.create = function (author) {
        new $scope.authorsResource(author).$save().then(function (newAuthor) {
            $scope.library.push(newAuthor);
            $scope.currentView = 'main';
        })
    }
    
     $scope.update = function (author) {

 
        $http({
            url: baseUrl.author_dom + author.id,
            method: "PUT",
            data: author
        }).then(function (modifiedItem) {
            for (var i = 0; i < $scope.library.length; i++) {
                if ($scope.library[i].id == modifiedItem.id) {
                    $scope.library[i].book[i].push(modifiedItem);
                    break;
                }
            }
        });
         $scope.currentView = 'main'
    }
  
    $scope.delete = function (author) {
        author.$delete().then(function () {
            $scope.library.splice($scope.library.indexOf(author), 1);
        });
    }
    
    
    $scope.editOrCreate = function (author) {
        $scope.newAuthor = author ? author : {};
        $scope.currentView = 'editAuthor'
    }
    
    $scope.saveEdit = function (author) {
        if (angular.isDefined(author.id)) {
            $scope.update(author);
        } else {
            $scope.create(author);
        }
    }
    
    $scope.cancelEdit = function () {
        if ($scope.newAuthor && $scope.newAuthor.$get) {
            $scope.newAuthor.$get();
        }
        $scope.newAuthor = {};
        $scope.currentView = 'main';
    }
    
    
  
    $scope.refresh();
        
    
})