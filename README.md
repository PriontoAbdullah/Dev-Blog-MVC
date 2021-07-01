# Drive Into NodeJS



### Project Directory
- [ ] Models
    - > User
        01. Name
        02. Email
        03. Password
        04. Profile

    - > Profile
        01. User
        02. Title
        03. Bio
        04. ProfilePic
        05. Links
        06. Post
        07. Bookmarks

    - > Post
        01. Title
        02. Body
        03. Authore,
        04. Tags
        05. Thumbnail
        06. Read Time
        07. Likes
        08. Dislikes
        09. Comments

    - > Comment
        01. Post
        02. User
        03. Body
        04. Replies
            - [x] Body
            - [x] User
            - [x] Time
- [ ] Controllers
    ##### Authentication Controllers
    - > signupGetController
    - > signupPostController

    - > LoginGetController
    - > LoginPostController

    - > LogoutController
    ##### Dashboard Controller
    ##### Upload Controller
- [ ] Middleware
    - >  authMiddleware
    - >  setLocals
    - > middlewares
    - > uploadMiddleware
- [ ] Routes
  - > ##### Authentication Routes
        *   Get Signup
        *   Post Signup

        *   Get Login
        *   Post Login

        *   Get Logout
  - > ##### Dashboard Routes
  - >  ##### Routes

- [ ] Config
    - [x] config.js
    - [x] default.json
    - [x] development.json
    - [x] production.json
    - [x] custom-evnironment-variables.json
- [ ] Api
    - [x] Controlers
    - [x] Routes
- [ ] Utils
    *   validationErrorFormatter
- [ ] Views
    - [x] Pages
        * auth
            - > login.ejs
            - > signup.ejs
    - [x] Partials
        - > header.ejs
        - > navigation.ejs
        - > footer.ejs
    - [x] Dashboard
        - > dashboard.ejs
        - > create-profile.ejs
- [ ] Validator
    - [x] Auth
        - >loginValidator.js
        - > signupValidator.js
- [ ] Public
    - [x] Images
    - [x] scripts
        - > profilePicsUpload.js
    - [x] styles
        - > style.css
    - [x] Uploads
        - > Uploads All Images

- [ ] node_modules Auto Genereted



### Files
- [x] app.js Main file
- [x] package.json Atometed Generated
- [x] README.md For Markdown  this project
- [x] .gitingonre Don't Send the github repo using this file
- [x] yarn.lock Auto Generated

### Working Process Fronend
*   Signup page
*   Login page


###  Working Process Backend
-   > mongodb database connected
-   > password hashed
-   > env

### Authentication Validation
-   > username
-   > email
-   > password
-   > confirmPassword
### Profile Info
-   > Create Profile
-   > Update Profile
### Show Error Message
-   > Signup page
-   > Login page
-   > Set Session Cookie in brawser
-   > Set Session on Database
-   > Create Flash Message Every Controller
-   > Show Alert Message Every page for errors

### Upload File
-   > create Storage using multer (npm pakage)
-   > Upload and Remove Profile Picture

### plyground for validation
-   > playground function
-   > express-validator
-   > create error object

### Environment
-   > Set Development 
    - [x] export NODE_ENV=DEVELOPMENT
    - [x] export NODE_ENV=production


### Error
-   > Syntax Error
-   > Runtime Error
-   > Logical Error

### Error Page Handle
- [x] 404 page not found
- [x] 500 server Error

### app.js inspect mode
-   > node inspect app.js
-   > Open Browser write urlbar chrome://inspect


