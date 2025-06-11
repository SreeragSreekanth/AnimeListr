import requests

# Mapping AniList status to your Django choices
ANILIST_STATUS_MAP = {
    "FINISHED": "completed",
    "RELEASING": "ongoing",
    "NOT_YET_RELEASED": "upcoming",
    "CANCELLED": "upcoming",  # optional choice — map as needed
    "HIATUS": "ongoing",      # you can decide if it fits better as upcoming
}

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
        format
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
    media = data.get('data', {}).get('Media')

    if not media:
        return None

    # 🧠 Normalize status to Django format
    normalized_status = ANILIST_STATUS_MAP.get(media['status'], 'ongoing')  # fallback if missing

    return {
        'title': media['title']['romaji'],
        'description': media['description'],
        'cover_image': media['coverImage']['large'],
        'episode_count': media['episodes'],
        'status': normalized_status,
        'release_year': media['startDate']['year'],
        'genres': media['genres'],
        "type": media.get("format", "UNKNOWN"),
        'anilist_id': media['id']
    }
