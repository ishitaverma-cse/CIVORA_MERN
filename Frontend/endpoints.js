export const BASE_URL = 'https://civora-mern.onrender.com'

//user (auth)
export const REGISTER = '/citizen/register'
export const LOGIN = '/admin/login'
export const SENDOTP = '/admin/sendOtp'
export const RESETPASSWORD = '/admin/resetPassword'
export const ALLCITIZEN = '/admin/allCitizens'
export const BLOCKUSER = '/admin/blockUser'

//Dashboard
export const DASHBOARD = '/admin/dashboard'

//HOME
export const HOMESTATS = "/citizen/homee/stats";

//Category
export const ADDCATEGORY = '/admin/category/add'
export const ALLCATEGORY = '/admin/category/all'
export const SINGLECATEGORY = '/admin/category/single'
export const UPDATECATEGORY = '/admin/category/update'
export const DELETECATEGORY = '/admin/category/softDelete'

//Issues -> Admin & Citizen
export const ADMIN_ALLISSUE = '/admin/issue/all'
export const ADMIN_SINGLEISSUE = '/admin/issue/single'
export const ADMIN_DELETEISSUE = '/admin/issue/softDelete'
export const ADMIN_PUBLICISSUE = '/admin/issue/public'
export const ADMIN_UNASSIGNEDISSUES = '/admin/issue/unassignedIssues'
export const ADMIN_ASSIGNISSUE = '/admin/issue/assignIssue'
export const ADMIN_LATESTISSUES = '/admin/issue/latestIssues'

export const CITIZEN_ADDISSUE = '/citizen/issue/add'
export const CITIZEN_ALLISSUE = '/citizen/issue/all'
export const CITIZEN_SINGLEISSUE = '/citizen/issue/single'
export const CITIZEN_UPDATEISSUE = '/citizen/issue/update'
export const CITIZEN_DELETEISSUE = '/citizen/issue/softDelete'
export const CITIZEN_MYISSUE = '/citizen/issue/my'
export const CITIZEN_PUBLICISSUE = '/citizen/issue/public'

export const EMP_ALLISSUE = '/employee/issue/all'
export const EMP_UPDATEISSUE = '/employee/issue/update'

//Employee 
export const ADDEMPLOYEE = '/admin/employee/add'
export const ALLEMPLOYEE = '/admin/employee/all'
export const SINGLEEMPLOYEE = '/admin/employee/single'
export const UPDATEEMPLOYEE = '/admin/employee/update'
export const DELETEEMPLOYEE = '/admin/employee/softDelete'
export const ALLEMPLOYEES = '/admin/employee/allEmployees'
export const PROFILE = '/employee/employee/profile'
export const UPDATEPROFILE = '/employee/employee/updateProfile'

//Upvote -> Admin & Citizen
export const ADMIN_ALLUPVOTE = '/admin/upvote/all'

export const CITIZEN_ADDUPVOTE = '/citizen/upvote/add'
export const CITIZEN_ALLUPVOTE = '/citizen/upvote/all'
export const CITIZEN_SINGLEUPVOTE = '/citizen/upvote/single'
export const CITIZEN_DELETEUPVOTE = '/citizen/upvote/softDelete'


//Assignment 
export const ADDASSIGNMENT = '/admin/assignment/add'
export const ALLASSIGNMENT = '/admin/assignment/all'
export const SINGLEASSIGNMENT = '/admin/assignment/single'
export const UPDATEASSIGNMENT = '/admin/assignment/update'
export const DELETEASSIGNMENT = '/admin/assignment/softDelete'

//Contact
export const ADDCONTACT = '/citizen/contact/add'

//Notification
export const MYNOTIFICATIONS = '/citizen/notification/myNotifications'
export const ADMIN_NOTIFICATIONS = '/admin/notification/admin'