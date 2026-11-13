import http.server
import socketserver
import urllib.request
import json
import urllib.error
import urllib.parse

PORT = 3002
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*'
}

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        qs = urllib.parse.parse_qs(parsed.query)

        if parsed.path == '/api/districts':
            city_id = qs.get('cityId', [''])[0]
            target_url = f'https://api.nhathuoclongchau.com.vn/lccus/ecom-prod/store-front/v3/regions/legacy/districts?type=1&cityId={city_id}'
        elif parsed.path == '/api/wards':
            dist_id = qs.get('districtId', [''])[0]
            target_url = f'https://api.nhathuoclongchau.com.vn/lccus/ecom-prod/store-front/v3/regions/legacy/wards?type=1&districtId={dist_id}'
        else:
            self.send_response(404)
            self.end_headers()
            return

        req = urllib.request.Request(target_url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = resp.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(data)
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

    def do_POST(self):
        if self.path == '/api/lookups':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            target_url = 'https://api.nhathuoclongchau.com.vn/lccus/ecom-prod/store-front/v3/regions/lookups'
            post_headers = dict(HEADERS)
            post_headers['Content-Type'] = 'application/json'
            req = urllib.request.Request(target_url, data=post_data, headers=post_headers)
            try:
                with urllib.request.urlopen(req, timeout=10) as resp:
                    res_body = resp.read()
                    self.send_response(resp.status)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(res_body)
            except urllib.error.HTTPError as e:
                err_body = e.read()
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(err_body)
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), ProxyHandler) as httpd:
        print(f"Python Bridge Server running on port {PORT}")
        httpd.serve_forever()
