# pulse AIPs

authRouter
-POST /Sign up
-POST /login
-POST /logout

profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

connectionRequestRouter

<!-- right swipe=like -->
<!-- left swipe=pass -->

-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

userRouter

-GET /user/connections
-GET /user/requests/received
-GET /user/feed -gets you the profiles of other users on platform

Status : ignore ,interested ,accepted,rejected
ignore=pass
interested=like
