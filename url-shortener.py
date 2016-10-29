import json

from flask import Flask, redirect, request, render_template
from env import DB
from helpers import url_regex
from hydra import Hydra

app = Flask(__name__)


@app.route('/')
def front_page():
    return render_template('index.html')


@app.route('/a', methods=['POST'])
def add():
    result = {
        'error': None,
        'success': False,
        'id': None
    }

    try:
        url = request.get_json()['url']
    except KeyError:
        result['error'] = "No URL specified!"
        return json.dumps(result), 400

    # don't allow invalid and recursive urls
    if (not url_regex.match(url)) or url.find(request.headers['Host']) != -1:
        result['error'] = "Invalid URL specified!"
        return json.dumps(result), 400

    # save all urls with protocol, http is used if none is found in the url
    try:
        url.index('http', 0, 5)
    except ValueError:
        url = 'http://' + url

    conn = DB.get()
    cur = conn.cursor()
    cur.execute('''INSERT INTO urls(url) VALUES(%s)''', [url])
    idx = Hydra.dehydrate(conn.insert_id())
    conn.commit()

    result['success'] = True
    result['id'] = idx

    return json.dumps(result), 200


@app.route('/<url_id>')
def url_redirect(url_id):
    try:
        db_id = Hydra.hydrate(url_id)
    except ValueError:
        return 'Invalid parameters'

    conn = DB.get()
    cur = conn.cursor()
    cur.execute('''SELECT url FROM urls WHERE id =%s''', [db_id])
    result = cur.fetchone()

    if result is not None:
        return redirect(location=result[0], code=302)
    else:
        return 'URL not found', 404


if __name__ == '__main__':
    app.run()
