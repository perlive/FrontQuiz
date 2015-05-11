var app = angular.module('quizApp', []);

app.directive('quiz', function (quizFactory) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'quiz_T.html',
        link: function (scope, elem, attrs) {
            scope.start = function (type) {
                scope.id = 0;
                scope.quizOver = false;
                scope.inProgress = true;
                scope.type = type
                //scope.questions = quizFactory.setQuestions(type);
                //scope.setQuestions();
                scope.getQuestion();
            };

            scope.reset = function () {
                scope.inProgress = false;
                scope.score = 0;
            }

            scope.setQuestions = function () {
                var qPromise = quizFactory.setQuestions(scope.type);
                qPromise.then(function (response) {
                    quizFactory.questions = response.data;
                    alert(response);
                });
                }
            
             
            scope.getQuestion = function () {
                var q = getQuestion(scope, quizFactory)
                if (q) {
                    scope.question = q.question;
                    scope.options = q.options;
                    scope.answer = q.answer;
                    scope.answerMode = true;
                } else {
                    scope.quizOver = true;
                }
            };

            scope.checkQuestion = function () {
                if (!$('input[name=answer]:checked').length) return;

                var ans = $('input[name=answer]:checked').val();

                if (ans == scope.options[scope.answer]) {
                    scope.score++;
                    scope.correctAns = true;
                } else {
                    scope.correctAns = false;
                }

                scope.answerMode = false;
            };

            scope.nextQuestion = function () {
                scope.id++;
                scope.getQuestion();
            }

            scope.reset();
        }
    }
});

app.factory('quizFactory', function ($http) {
    
    var questions = [];

    var setQuestions = function(type){

        return $http.get("../jsondata/" + type + ".json")
            .then(function (response) {
                return response.data;
            });
        //    .success(function (data) {
        //        questions = data;
        //    })
        //.error(function (data) {
        //    questions.push(
        //       {
        //           question: "Did the Json get Fail?",
        //           options: ["Yes", "No"],
        //           answer: 0
        //       }
        //   );
        //});
    }

    /*var getQuestion = function (questions, id) {
        //if (questions.length === 0) {
        //    setQuestions(type)
        //}
        if (id < questions.length) {
            return questions[id];
        } else {
            return false;
        }
    }*/

    return {
        //questions:questions,
        setQuestions: setQuestions//,
        //getQuestion: getQuestion
    };
});

function getQuestion($scope, quizFactory) {
    var quizPromise = quizFactory.setQuestions($scope.type);
    quizPromise.then(function (response) {
        $scope.questions = response;
        if ($scope.id < $scope.questions.length) {
            return $scope.questions[$scope.id];
        } else {
            return false;
        }
    })
}