# pulse AIPs

-POST /Sign up

-POST /login

-POST /logout

-GET /profile/view

-PATCH /profile/edit

-PATCH /profile/password

<!-- right swipe=like -->
<!-- left swipe=pass -->

-POST /request/send/like/:userId
-POST /request/send/pass/:userId

-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

-GET /connections
-GET /requests/received
-GET /feed -gets you the profiles of other users on platform

Status : ignore ,interested ,accepted,rejected
ignore=pass
interested=like
