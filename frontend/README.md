q.how you assign a order to delivery boys whose near by

( What problem this function solves

An order can contain multiple shop orders.
When a shop marks its order as “out for delivery”, the system must:

Find nearby delivery boys

Check who is free

Create a delivery assignment

Broadcast the order to them

Step-by-step mental model
1️⃣ Parent Order is the source of truth

I first fetch the Order document because:

Shop orders are embedded inside it

Any update must be saved on the parent

2️⃣ Each shop has its own lifecycle

I find the specific shop’s order inside order.shopOrders
Because:

One order can involve multiple shops

Each shop has its own status and delivery flow

3️⃣ Status update is always local to that shop

I update only:

shopOrder.status


Not the full order.

4️⃣ Delivery assignment is created only once

I create a delivery assignment only when:

Status becomes "out for delivery"

AND there is no existing assignment

This prevents duplicate assignments.

5️⃣ Finding nearby delivery boys

I use MongoDB geospatial query:

$near

2dsphere index

5km radius

This ensures I only fetch physically nearby delivery boys.

6️⃣ Filtering busy vs available delivery boys

Not all nearby delivery boys are free.

So I:

Find delivery boys already assigned to active orders

Remove them from the nearby list

Keep only available ones

7️⃣ Broadcasting the order

Instead of assigning immediately:

I broadcast the order to multiple delivery boys

They can later accept it

This avoids race conditions and improves availability.

8️⃣ Why DeliveryAssignment exists

DeliveryAssignment tracks:

Which order was broadcasted

To whom

Current assignment status

This keeps delivery logic separate from order logic.

9️⃣ Why save only the parent document

Shop orders are embedded documents.
Saving the parent order automatically persists:

Status changes

Assignment references

💡 Key design decision (this impresses interviewers)

“Orders are immutable business entities.
Delivery assignment is a workflow entity.”

That’s why:

Orders don’t track delivery logic

DeliveryAssignment does
)

🟢 Backend Overview – Zesto


Packages I Used

bcrypt – for hashing the password with salt
cookie-parser – to store JWT token in cookies
cors – allows communication between frontend and backend
crypto – used to generate random 6-digit OTP
dotenv – stores sensitive information like password, secret key
express – backend framework
jsonwebtoken – creates token so server can recognize user on every request
mongoose – helps to create schema and interact with MongoDB
nodemailer – used to send emails (OTP, reset password)
nodemon – automatically restarts server after changes
multer - it get the file from the frontend into backend.and gives us object req.file
cloudinary - we can store the file in our backend. file can be heavy so it store file and gives us a url of the file. so we can used directly.

Folder Structure in Backend
1. config
Contains db.js
Used to connect MongoDB with the application

2. controller – main business logic
auth.js
Contains all authentication related logic:
signup
signin
signout
sendOtp
verifyOtp
resetPassword
signupWithGoogle
signinWithGoogle
userController.js
Only used to get current logged-in user details

3. middleware
isAuth.js
Works between route and controller
Decodes JWT token
Used to get current user in protected routes

4. Model
userModel.js
Contains schema for User
Defines fields like name, email, password, role etc

5. node_modules
Automatically created when we install express and other packages

6. Routes
All routes are separated to keep project clean:
AuthRouter.js
Routes related to authentication
signup, signin, otp, reset etc
UserRouter.js
Routes related to user operations

7. utils
Contains reusable logic:
generateToken.js – creates JWT token
mail.js – handles sending emails using nodemailer

8. .env
Stores sensitive data like:
database URL
email password
JWT secret key

9. index.js
Entry point of the backend
Connects everything:
database
routes
middleware
server start


🟢 Frontend Overview – Zesto

Packages I Used
@reduxjs/toolkit – for managing global state
@tailwindcss/vite – to configure Tailwind with Vite
axios – to call backend APIs
firebase – for Google authentication
lucide-react – for icons
react – main library for UI
react-dom – connects React with browser DOM
react-hot-toast – for showing notifications
react-icons – extra icon library
react-redux – connects Redux with React
react-router-dom – for routing between pages
tailwindcss – for styling

Folder Structure in Frontend
1. node_modules
Automatically created when we install packages

2. public
Contains static files

3. src – main working folder

1.assets
Contains logo and images

2.components
Navbar.jsx – main navigation bar
UserDashboard.jsx – dashboard for normal user
OwnerDashboard.jsx – dashboard for restaurant owner
DeliveryBoyDashboard.jsx – dashboard for delivery boy

3.hooks – custom hooks
useGetCurrentUser.jsx – gets currently logged-in user
useGetCity.jsx – fetches current location of user
     in useEffect i have to write inbuild navigator.geolocation.getCurrentPosition -> then the async callabck (async (position)=>{}) it send us coords object in that we found the lang and lat. to convert it into the city name. we have to use jioapify which is free website we have to go there make a account then we have to cliked on create new project. after we create project with our desired name it generate the key. then we search for reverse location because that what we need. we are trying to get the city name only. so in particular tag we found the url also and using our key we fetch the city. which is coming in result

4.pages
signin.jsx – login page
signup.jsx – register page
forgotPassword.jsx – reset password page

5.redux – state management
store.js – Redux store configuration
userSlice.js – stores user data globally

Other Important Files

App.jsx – contains main routes and layout

main.jsx – entry point of React app

index.css – global styles

firebase.js – configuration for Google authentication

🟢 SIGNUP FLOW – (From SignUp.jsx)
A. Normal Signup Flow
1. User Side (Frontend)

User open → /signup page

User fill form:
fullName
email
password
confirmPassword
mobileNumber
role (user / owner / deliveryBoy)

When user click Sign Up button:
👉 handleSubmit() function run

Frontend first check:
password === confirmPassword

if not match → show toast error
→ “Passwords do not match”

If password correct:
remove confirmPassword from data
create object dataToSend

Axios call:
→ POST http://localhost:8000/api/auth/signup

with:
form data
withCredentials: true (for cookie)

After success:
Redux action run
→ dispatch(setUserData(response.data))

show toast
→ “Account created successfully”

after 2 second
→ navigate to /signin

2. Backend Work (Based on your backend)

When this API hit:
/api/auth/signup
Backend:
Controller signup logic run
It will:
check email already exist
hash password using bcrypt
create user in MongoDB
generate OTP using crypto
send mail using nodemailer
save OTP in DB
Response send to frontend
Cookie also set with JWT

B. Google Signup Flow
1. User Click → “Sign up with Google”
👉 handleGoogleAuth() run
Firebase popup open
User select google account

Firebase return:
displayName
email

Frontend store:

googleData = {
  fullName,
  email
}

Then:
👉 showPhoneModal = true
Because:
Google not give phone number
but our system need phone.

2. Phone Modal Step
User enter:
mobile number

select role (already selected)

Then user click:
👉 “Complete Signup”
→ completeGoogleSignup() run

3. Google Signup API Call

Frontend create payload:
fullName (from google)
email (from google)
mobileNumber (manual)
role

Axios call:
→ POST /api/auth/signupwithgoogle

4. Backend for Google Signup

Backend:
check email exist or not
if not exist → create new user
no password required
generate JWT
set cookie
return user data

5. After Success

Frontend:

dispatch(setUserData(data))
show toast “Signup complete!”

🟢 Redux Part in Signup

After both flows:
Normal signup
Google signup

Same action used:
dispatch(setUserData(...))

So:
user data stored in redux
whole app can access logged user

🟢 Signup Flow – Zesto (Paragraph Explanation)
    In the Zesto application, the signup process starts from the SignUp.jsx page where the user fills basic details like full name, email, password, confirm password, mobile number, and selects a role such as user, owner, or delivery boy. When the user clicks the Sign Up button, the frontend first checks whether the password and confirm password fields match. If they do not match, a toast message is shown and the request is stopped at the frontend itself. If everything is correct, the confirm password field is removed and the remaining data is sent to the backend using axios at the route /api/auth/signup with credentials enabled so cookies can be stored.

    On the backend side, the signup controller receives this data, checks if the email already exists, hashes the password using bcrypt with salt, and creates a new user in MongoDB using the user model. After creating the user, the backend generates a 6-digit OTP using the crypto package and sends that OTP to the user’s email through nodemailer. A JWT token is also generated and stored in cookies. The response is sent back to the frontend, where the Redux action setUserData stores the user information globally, a success toast is shown, and the user is redirected to the sign-in page.

    For Google signup, the flow is a little different. When the user clicks Sign up with Google, Firebase authentication opens a popup and returns the user’s Google email and name. Since Google does not provide a phone number, a modal appears asking the user to enter their mobile number and select a role. After entering the phone, the frontend sends this combined data to the backend route /api/auth/signupwithgoogle. The backend checks if the user already exists, and if not, creates a new user without a password, generates a JWT token, sets the cookie, and returns the user data. The frontend again stores this data in Redux using setUserData and shows a success message.

    Overall, the signup flow connects frontend validation, Firebase for Google auth, axios API calls, backend controllers, MongoDB models, JWT cookies, and Redux state management to create a complete and secure registration system in Zesto.

🟢 Signin Flow – Step by Step
1. User Opens SignIn Page
User comes to SignIn.jsx.

Form contains:
email
password
Sign in button
Google sign in button
Forgot password link

2. Normal Email/Password Signin
User enters email and password.

On submit:
handleSubmit function runs

axios sends data to backend route
👉 POST /api/auth/signin

{ withCredentials: true } is used so cookie can be stored.

3. Backend Process

Backend controller:
finds user by email
compares password using bcrypt
if correct → generates JWT token
token is stored in cookie
user data is returned.

4. Frontend After Success
response comes to frontend
Redux action setUserData stores user globally
success toast shown
user can be redirected to dashboard.

5. If Error
wrong password / email → backend sends message
frontend shows toast with error message.

🔹 Google Signin Flow
1. User Clicks Google Button

Firebase popup opens using
signInWithPopup(auth, provider)

2. After Google Success
Firebase returns user email

frontend sends only email to backend
POST /api/auth/singinwithgoogle

3. Backend
checks if user exists
if exists → generate JWT + set cookie
if not → return 404 so user can go to signup.

4. Frontend
on success:
Redux setUserData stores data
toast “Welcome back”

on 404:
show message → redirect to signup.

🔹 Paragraph Explanation (For Presentation)
    In the signin process, the user comes to the SignIn.jsx page where two options are available, normal email-password login and Google login. When the user enters email and password and clicks the Sign In button, the handleSubmit function is triggered. This function sends the form data to the backend using axios at the route /api/auth/signin with credentials enabled so that the JWT token can be stored in cookies.

    On the backend side, the signin controller first finds the user by email, then compares the entered password with the hashed password stored in the database using bcrypt. If the password matches, a JWT token is generated and stored in cookies, and the user data is sent back to the frontend. The frontend then dispatches the Redux action setUserData to store the user information globally and shows a success toast message. If the email or password is wrong, the backend returns an error message which is displayed using toast.

    For Google signin, when the user clicks Sign in with Google, Firebase authentication opens a popup and returns the user email after successful authentication. The frontend sends this email to the backend route /api/auth/singinwithgoogle. The backend checks whether this email already exists in the database. If the user exists, a JWT token is generated and stored in cookies and the user data is returned. If the user does not exist, a 404 response is sent and the frontend shows a message to redirect the user to complete signup. After successful Google signin, the Redux store is updated using setUserData and the user gets access to the application.



🟢 Forgot Password Flow – Step by Step

User opens ForgotPassword.jsx page
First screen asks only for:
email address

User clicks Get OTP button
handleSendOTP function runs

axios call goes to backend:
👉 POST /api/auth/sendotp

Backend Work

Backend checks:
email exists or not

If user found:
generate 6 digit OTP using crypto
save OTP temporarily
send OTP to email using nodemailer
Response sent → “OTP sent successfully”

Frontend After Success
toast message shown
step changes from 1 → 2
Step 2 – OTP Verification
User enters OTP received on email

Click Verify Code
handleVerifyOTP function runs

axios call:
👉 POST /api/auth/verifyotp
data → { email, otp }

Backend Work
match OTP with stored OTP
if correct → allow next step
if wrong → send error

Frontend
on success → step changes 2 → 3
on error → toast shows message

Step 3 – Reset Password
User enters:
new password
confirm password

Frontend checks:
both passwords must match
handleResetPassword runs

axios call:
👉 POST /api/auth/resetpassword

Backend Work
hash new password using bcrypt
update password in database
remove old OTP
send success response

Frontend
success toast
user redirected to /signin



🔹 Paragraph Explanation (Your Presentation Style)
    In the forgot password process, the user comes to the ForgotPassword.jsx page where the flow is divided into three steps. In the first step, the user enters the email address and clicks the Get OTP button. The handleSendOTP function sends this email to the backend route /api/auth/sendotp using axios with credentials enabled. On the backend, the system checks whether the email exists in the database. If the user is found, a 6-digit OTP is generated using the crypto package and that OTP is sent to the user’s email using nodemailer. After successful response, the frontend shows a toast message and moves the UI from step 1 to step 2.

    In the second step, the user enters the OTP received on email. When the user clicks Verify Code, the handleVerifyOTP function sends the email and OTP to the backend route /api/auth/verifyotp. The backend compares the OTP with the stored value. If the OTP is correct, the backend allows the user to proceed, and the frontend moves to step 3. If the OTP is wrong or expired, an error message is returned and shown using toast.

    In the third and final step, the user enters a new password and confirms it. The frontend first checks whether both passwords match. Then the handleResetPassword function sends the email and new password to the backend route /api/auth/resetpassword. The backend hashes the new password using bcrypt, updates it in the database, removes the old OTP, and sends a success response. After that, the frontend shows a success message and redirects the user to the signin page.



    ((((issue that i encounter while making this app. it logout when i refresh the page. so actully when refresh the redux store become null. so the routing checke userData exits or not if not so it back on signup page. ))))