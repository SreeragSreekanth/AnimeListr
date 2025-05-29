import requests

def fetch_anilist_data(title):
    url = 'https://graphql.anilist.co'
    query = '''
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        id
        title {
          romaji
        }
        description
        coverImage {
          large
        }
        episodes
        status
        startDate {
          year
        }
        genres
      }
    }
    '''
    variables = {'search': title}
    response = requests.post(url, json={'query': query, 'variables': variables})
    data = response.json()
    return data.get('data', {}).get('Media')
