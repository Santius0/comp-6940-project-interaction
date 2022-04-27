from rest_framework.decorators import api_view
from rest_framework.response import Response
import json

from . import utils


@api_view(['GET'])
def main(request):
    return Response(['Hello There', 'Hey There'])


@api_view(['POST'])
def predict_song(request):
    data = json.loads(request.body.decode("utf-8"))
    # print(data['f'])
    results = utils.process_song(data)
    return Response(results)


@api_view(['POST'])
def spotify_search(request):
    data = json.loads(request.body.decode("utf-8"))
    return Response(utils.search_spotify(data))


@api_view(['GET'])
def all_songs(request):
    return Response(utils.all_songs())
