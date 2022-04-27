from core.audio import extract_audio_features
from core.spotify import query_spotify, song_id_lookup, spotify_audio_analysis
from core.youtube import yt_query, yt_download_audio
import pandas as pd
import os
from django.conf import settings
import json
from joblib import load
import warnings

warnings.filterwarnings("ignore")


MEDIA_ROOT = settings.MEDIA_ROOT
# billboard_data = os.path.join(MEDIA_ROOT, "hot-100_all.csv")
# DIR = os.path.dirname(os.path.dirname(__file__))

data_df = pd.read_csv(os.path.join(MEDIA_ROOT, "data.csv"))
data_df.drop(labels='Unnamed: 0', axis=1, inplace=True)

pop_metrics_df = pd.read_csv(os.path.join(MEDIA_ROOT, "popularity_metrics.csv"))
pop_metrics_df['index'] = pop_metrics_df.apply(lambda x: x['Unnamed: 0'], axis=1)
pop_metrics_df.drop(labels='Unnamed: 0', axis=1, inplace=True)
pop_metrics_df['avg_rank_score'] = pop_metrics_df['avg_rank_score'].apply(lambda x: round(x, 2))

spotify_df = pd.read_csv(os.path.join(MEDIA_ROOT, "songs.csv"))

complete_df = pd.concat([data_df, pop_metrics_df], axis=1)

linear_regression_model_config = load(os.path.join(MEDIA_ROOT, 'models', 'linear_regression_all_best_2.joblib'))
linear_regression_model = linear_regression_model_config['model']
linear_regression_model_features = linear_regression_model_config['features']

svm_classification_model = load(os.path.join(MEDIA_ROOT, 'models', 'svm_classification_best.joblib'))


AUDIO_PATH = os.path.join(MEDIA_ROOT, "audio")


def all_songs():
    results = {
        "x_columns": data_df.columns,
        "y_columns": pop_metrics_df.columns,
        "all_songs": complete_df.to_dict(),
        "all_songs_list": json.dumps(complete_df.to_dict('records')),
    }
    return results


def search_spotify(data):
    results = query_spotify(data['search_string'])
    final_results = []
    results = results[:5]
    for r in results:
        final_results.append({
            "id": r['id'],
            "name": r['name'],
            "artists": ' '.join([a['name'] for a in r['artists']])
        })
    return final_results


def process_song(data):
    audio_file = None
    song_id = data['song_id']
    song_name = data['song_name']

    # song_in_dataset = spotify_df[spotify_df['spotify_name'] == song_name]
    # if len(song_in_dataset) > 0:
    # song = complete_df[complete_df.index == 965]
    # print(song)
    # return {
    #     "song_data": json.dumps(song.to_dict('records')),
    #     "prediction": 12,
    #     "prediction_type": "regression",
    # }

    # get spotify metadata
    song_data, spotify_audio_features, audio_analysis = song_id_lookup(song_id)
    song_data = pd.get_dummies(song_data, prefix=['explicit'], columns=['explicit'])
    if 'explicit_True' not in song_data.columns:
        song_data['explicit_True'] = 0
    if 'explicit_False' not in song_data.columns:
        song_data['explicit_False'] = 0

    audio_analysis = spotify_audio_analysis(audio_analysis)

    song_data['billboard_name'] = song_name
    song_data['artist'] = None

    # get song audio from YouTube or from upload
    # query_string = f"{song_name} {song['artist']} lyrics"
    query_string = f"{song_name} lyrics"
    yt_id = yt_query(query_string, all_ids=False)
    # print(f"{song['billboard_name']}: {yt_id}")
    try:
        audio_file, _ = yt_download_audio(yt_id, output_dir=AUDIO_PATH)
        audio_features, _ = extract_audio_features(audio_file, song_name=song_name)
    except Exception as e:
        raise Exception(e)
    finally:
        if audio_file and os.path.isfile(audio_file):
            os.remove(audio_file)

    # construct X dataframe from all data gathered
    # print(type(song_data))
    # print(type(audio_features))
    # print(type(audio_analysis))
    df = pd.concat([song_data, spotify_audio_features, audio_features, audio_analysis], axis=1)
    # print(df)
    # df.to_csv(f"{MEDIA_ROOT}\\df.csv")
    # audio_features.to_csv(f"{base_dir}\\af.csv")

    # do prediction using model

    X = df.drop(axis=1, labels=['spotify_name',
                                'artist',
                                'artist_genres',
                                'spotify_id',
                                'spotify_id',
                                'spotify_uri',
                                'spotify_external_url',
                                'spotify_artist_popularity',
                                'preview_url',
                                'preview_url_audio',
                                'full_audio',
                                'full_audio_duration_s',
                                'name',
                                'billboard_name']
                )

    regr_prediction = linear_regression_model.predict(X[linear_regression_model_features])
    print(regr_prediction)

    svm_prediction = svm_classification_model.predict(X[data_df.drop(labels='billboard_name', axis=1).columns])
    print(svm_prediction)

    df['debut_rank'] = regr_prediction
    df['top_50'] = svm_prediction

    # return prediction
    return {
        "song_data": json.dumps(df.to_dict("records")),
        "regr_prediction": regr_prediction,
        "svm_prediction": svm_prediction,
    }
