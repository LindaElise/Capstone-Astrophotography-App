# Capstone Project
**Project Name:** Astrophotography Web Application
<br>
**API:** [NASA Open API](https://api.nasa.gov/).
### Description
The Astrophotography Webb Application will allow you to display NASA's imagery with over 140,000 astro pictures using the Astrophotography Picture of the Day (APOS) API. Users can create and account to add or removed their favority pictures and navigate throughout the calendar to display previous photos. Explore the wonders of the out space 🌠.
### User Flow
* Home Page
  - Main page will display the astrophotography of the day and the option to navigate throughout the calendar to find previous pictures. Calendar will allow to go back to year 1995.
* Login/Sign Up
  - Login or create an account using your email if you desired to add your favorite astro pictures from the 140,000 NASA photos. Add astropicture to your favorites.
* Favorites
  - User can look into their favorite astropictures in their account. Add or remove photos if desired.
* Logout
  - Log out from your account.
### API Information
APOD is the most popular websites at NASA is the Astronomy Picture of the Day. It has query parameters such as:
* date
  - The date of the APOD image to retrieve
* start_date
  - The start of a date range, when requesting date for a range of dates.
* end_date
  - The end of the date range, when used with start_date.
* count
  - If this is specified then count randomly chosen images will be returned.
* thumbs
  - Return the URL of video thumbnail. If an APOD is not a video, this parameter is ignored.
* api_key
  - api.nasa.gov key for expanded usage
