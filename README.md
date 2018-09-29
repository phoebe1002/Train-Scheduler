# Train-Scheduler
This app will provide up-to-date information about various trains, namely their arrival times and how many minutes remain until they arrive at their station.

### Goals
* Create a train schedule application that incorporates Firebase to host train data. 
* Man*age data from Firebase
* App will run in the browser
* Use JavaScript for the logic
* Use jQuery to dynamically manipulate HTML
* Manipulate the time with Moment.js.
* Make the design responsive

### End Results
* On 'Add Train' card, user is able to entry and store the following fields into Firebase:
    - Train Name
    - Destination 
    - First Train Time (validation rule: number only >> 24 hours format & without ":")
    - Frequency (validation rule: number only)

* After user clicks on 'Submit' button, 'Train Data' Card will display the following fields:
    - Train Name (retrieve from database)
    - Destination (retrieve from database)
    - Frequency (retrieve from database)
    - Next Arrival (calculated >> based on Current Time and Minutes Away )
    - Minutes Away(calculated >> based on provided fields like First Train Time and Frenquency)

* Users from many different machines are able to view same train times.

* Firebase authentication >> only users who log into the site with their Google or GitHub accounts can use your site. 


