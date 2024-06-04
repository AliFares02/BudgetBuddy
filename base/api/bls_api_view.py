import requests, json, time
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['POST'])
def inflationDataApiProxy(request):
  inflation_api_url = 'https://api.bls.gov/publicAPI/v2/timeseries/data/'
  headers = {'Content-Type': 'application/json'}
  data = json.loads(request.body.decode('utf-8'))
  print(f'request: {data}')
  
  startTime = time.time()
  response = requests.post(inflation_api_url, json=data, headers=headers)
  endTime = time.time()
  print(f"total time: {endTime-startTime}")
  if response.status_code == 200:
    return Response(response.json())
  else:
    return Response({'error': 'Failed to fetch data from the external API' }, status=response.status_code)