# comp-6940-project-interaction

### HomePage: https://cryptic-ridge-63537.herokuapp.com/
The 'Prediction' page of this application doesn't work on Heroku as the time and resources required to extract all the audio features and run a prediction are not permitted by Heroku, especially using a free account. If downloaded and run locally it should execute.

###Installation Guide
1. Clone the repository
2. Fill out .env with a vid Spotify API key
3. Install the application requirements via pip install -r requirements.txt
4. run the application locally using python manage.py runserver when in the projects root direectory


###About the application
1. Lists all songs present in the configured dataset based on the past two years of the Billboard hot-100
2. Allows users to compare a song's audio featurs alongside a specified popularity metric, by plotting the audio feature along the x-axis and the popularity metric along the y-axis. Users can hover over datapoints to see the relative position of a given song.
3. Users can search for a song (this users the spotify as a search backend), and generate a prediction for that song. That song is then added to the plots and can be compared to others. NOTE: Only the 'top_50' and 'debut_rank' y-variables will have these new data points present as prediction models for only those two have been added.
    That is one regression model estimateing a song's debut_rank and one classification model estimating a song's presence in the top 50. These are a Ridge Regression and SVM     Classifier respectively, as mentioned in the submitted paper.
    Again! This prediction will not work on the remote site due to computation limitations, to see it in action it must be built locally.
