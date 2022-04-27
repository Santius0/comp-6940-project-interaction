import os
import spotipy
from spotipy import SpotifyClientCredentials
import pandas as pd
import numpy as np
from dotenv import load_dotenv
from django.conf import settings

SPOTIPY_CLIENT_ID = settings.SPOTIPY_CLIENT_ID
SPOTIPY_CLIENT_SECRET = settings.SPOTIPY_CLIENT_SECRET
SPOTIPY_REDIRECT_URI = settings.SPOTIPY_REDIRECT_URI

# load_dotenv('../.env')


scope = "user-library-read"

spotify = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=SPOTIPY_CLIENT_ID,
                                                                client_secret=SPOTIPY_CLIENT_SECRET
                                                                ))

spotify_song_cols = [
    # 'billboard_name',
    'spotify_name',
    # 'artist',
    'duration_ms', 'spotify_id', 'spotify_uri',
                     'spotify_external_url', 'spotify_popularity', 'spotify_artist_popularity',
                     'spotify_artist_popularity_mean', 'explicit', 'preview_url', 'preview_url_audio', 'full_audio',
                     'full_audio_duration_s', 'artist_genres']

audio_feature_cols = ['danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness',
                      'instrumentalness', 'liveness', 'valence', 'tempo', 'time_signature']

audio_analysis_cols = ['audio_analysis_file']


def query_spotify(title, artist=None):
    title = title.replace("$", "s")
    results = spotify.search(q='track:' + title, type='track')['tracks']['items']
    # if that doesn't work get results with song name and first artist
    if len(results) == 0:
        artist = ' ' + artist.lower().split('featuring')[0] if artist else ''
        results = spotify.search(q='track:' + title + artist, type='track')['tracks']['items']
    return results


def song_id_lookup(song_id):
    song_data = spotify.track(song_id)
    artists = spotify.artists([ar['id'] for ar in song_data['artists']][:50])
    song_data['artist_popularity'] = [ar['popularity'] for ar in artists['artists']]
    artist_genres = []
    for ag in [ar['genres'] for ar in artists['artists']]:
        artist_genres += ag
    song_data['artist_genres'] = list(dict.fromkeys(artist_genres))
    audio_features = spotify.audio_features([song_data['id']])
    try:
        audio_analysis = spotify.audio_analysis(song_data['id'])
    except spotipy.SpotifyException:
        audio_analysis = None

    audio_features = audio_features[0]

    sd = pd.DataFrame(data=[[
        # song['title'],
        song_data['name'],
        # song['artist'],
        song_data['duration_ms'],
        song_data['id'],
        song_data['uri'],
        song_data['external_urls']['spotify'],
        song_data['popularity'],
        song_data['artist_popularity'],
        sum(song_data['artist_popularity']) / len(song_data['artist_popularity']),
        song_data['explicit'],
        song_data['preview_url'],
        None,
        None,
        None,
        song_data['artist_genres']]], columns=spotify_song_cols)

    af_df = pd.DataFrame(data=[[audio_features['danceability'],
                                audio_features['energy'],
                                audio_features['key'],
                                audio_features['loudness'],
                                audio_features['mode'],
                                audio_features['speechiness'],
                                audio_features['acousticness'],
                                audio_features['instrumentalness'],
                                audio_features['liveness'],
                                audio_features['valence'],
                                audio_features['tempo'],
                                audio_features['time_signature']]], columns=audio_feature_cols)

    return sd, af_df, audio_analysis


def spotify_audio_analysis(analysis_object):
    timbre_coefs = np.arange(12, 0, -1)
    bars = analysis_object['bars']
    beats = analysis_object['beats']
    sections = analysis_object['sections']
    segments = analysis_object['segments']
    tatums = analysis_object['tatums']

    return pd.DataFrame(data={
        "num_bars": len(bars),
        "mean_bar_duration": np.mean([b['duration'] for b in bars]),
        "var_bar_duration": np.var([b['duration'] for b in bars]),
        "num_beats": len(beats),
        "mean_beat_duration": np.mean([b['duration'] for b in beats]),
        "var_beat_duration": np.var([b['duration'] for b in beats]),
        "num_sections": len(sections),
        "mean_section_duration": np.mean([s['duration'] for s in sections]),
        "var_section_duration": np.var([s['duration'] for s in sections]),
        "mean_section_tempo": np.mean([s['tempo'] for s in sections]),
        "var_section_tempo": np.var([s['tempo'] for s in sections]),
        "mean_section_loudness": np.mean([s['loudness'] for s in sections]),
        "var_section_loudness": np.var([s['loudness'] for s in sections]),
        "num_segments": len(segments),
        "mean_segment_duration": np.mean([s['duration'] for s in segments]),
        "var_segment_duration": np.var([s['duration'] for s in segments]),
        "mean_segment_loudness_start": np.mean([s['loudness_start'] for s in segments]),
        "var_segment_loudness_start": np.var([s['loudness_start'] for s in segments]),
        "mean_segment_loudness_max": np.mean([s['loudness_max'] for s in segments]),
        "var_segment_loudness_max": np.var([s['loudness_max'] for s in segments]),
        "mean_segment_loudness_max_time": np.mean([s['loudness_max_time'] for s in segments]),
        "var_segment_loudness_max_time": np.var([s['loudness_max_time'] for s in segments]),
        "mean_segment_loudness_end": np.mean([s['loudness_end'] for s in segments]),
        "var_segment_loudness_end": np.var([s['loudness_end'] for s in segments]),
        "mean_segment_loudness_start_max_diff": np.mean([abs(s['loudness_start'] - s['loudness_max']) for s in segments]),
        "var_segment_loudness_start_max_diff": np.var([abs(s['loudness_start'] - s['loudness_max']) for s in segments]),
        "mean_segment_loudness_start_end_diff": np.mean([abs(s['loudness_start'] - s['loudness_end']) for s in segments]),
        "var_segment_loudness_start_end_diff": np.var([abs(s['loudness_start'] - s['loudness_end']) for s in segments]),
        "mean_segment_loudness_max_end_diff": np.mean([abs(s['loudness_max'] - s['loudness_end']) for s in segments]),
        "var_segment_loudness_max_end_diff": np.var([abs(s['loudness_max'] - s['loudness_end']) for s in segments]),
        "mean_segment_num_pitches": np.mean([len(s['pitches']) for s in segments]),
        "var_segment_num_pitches": np.var([len(s['pitches']) for s in segments]),
        "mean_segment_num_pure_pitches": np.mean([len(np.array(s['pitches'])[np.array(s['pitches']) > 0.5]) for s in segments]),
        "var_segment_num_pure_pitches": np.var([len(np.array(s['pitches'])[np.array(s['pitches']) > 0.5]) for s in segments]),
        "mean_segment_timbre": np.mean([np.dot(s['timbre'], timbre_coefs) for s in segments]),
        "var_segment_timbre": np.var([np.dot(s['timbre'], timbre_coefs) for s in segments]),
        "num_tatums": len(tatums),
        "mean_tatum_duration": np.mean([t['duration'] for t in tatums]),
        "var_tatum_duration": np.var([t['duration'] for t in tatums]),
    }, index=[0])
