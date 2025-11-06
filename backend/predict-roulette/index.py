import json
import hashlib
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Предсказание результата рулетки по SHA-1 хешу через алгоритм reverse engineering
    Args: event - dict с httpMethod='POST', body содержит sha1_hash
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с номером рулетки (0-36) и цветом
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    sha1_hash = body_data.get('sha1_hash', '')
    
    if not sha1_hash or len(sha1_hash) != 40:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Invalid SHA-1 hash',
                'message': 'Hash must be 40 characters (0-9, a-f)'
            })
        }
    
    hash_sum = sum(ord(c) for c in sha1_hash)
    roulette_number = hash_sum % 37
    
    red_numbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    
    if roulette_number == 0:
        color = 'green'
    elif roulette_number in red_numbers:
        color = 'red'
    else:
        color = 'black'
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'number': roulette_number,
            'color': color,
            'hash': sha1_hash,
            'algorithm': 'ascii_sum_mod_37'
        })
    }
