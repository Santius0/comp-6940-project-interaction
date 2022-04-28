# comp-6940-project-interaction

### HomePage: https://cryptic-ridge-63537.herokuapp.com/
This component of the project takes the form of a Django Web Application, with a built in React app as the frontend.

The 'Prediction' page of this application doesn't work on Heroku as the time and resources required to extract all the audio features and run a prediction are not permitted by Heroku, especially using a free account. If downloaded and run locally it should execute.

### Installation Guide - See [Django Getting Started](https://www.djangoproject.com/start/) for additional assistance.
1. Clone the repository
2. Fill out .env with valid Spotify API credentials.
      This file should have no whitespaces outside of quotes. Example: SPOTIFY_API_KEY='api-key' will work but SPOTIFY_API_KEY = 'api-key' will not.
      See [Spotify Web](https://developer.spotify.com/documentation/web-api/quick-start/).
3. Create and activate a virtual environment a virtual environment in the project's root directory. See [Virtualenv](https://virtualenv.pypa.io/en/latest/installation.html).
4. Install the application requirements in the virtual environment via "pip install -r requirements.txt" from the project's root directory.
5. Run the application locally using "python manage.py runserver" when in the projects root directory with the created virtual environment active.


### About the application
1. Lists all songs present in the configured dataset based on the past two years of the Billboard hot-100
2. Allows users to compare a song's audio features alongside a specified popularity metric, by plotting the audio feature along the x-axis and the popularity metric along the y-axis. Users can hover over data-points to see the relative position of a given song. The first page listing all songs can be used to select the songs that appear in the data plots.
3. Users can search for a song (the spotify search is used as the search backend), and generate a prediction for that song. That song is then added to the plots and can be compared to others. NOTE: Only the 'top_50' and 'debut_rank' y-variables will have these new data points present as prediction models for only those two have been added.
    That is one regression model estimating a song's debut_rank and one classification model estimating a song's presence in the top 50. These are a Ridge Regression and SVM     Classifier respectively, as mentioned in the submitted paper.
    Again! This prediction will not work on the remote site due to computation limitations, to see it in action it must be built locally.
