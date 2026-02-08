require "json"
require "net/http"
require 'uri'

def geocode(place)
  uri = URI("https://nominatim.openstreetmap.org/search")
  uri.query = URI.encode_www_form(
    q: place,
    format: "json",
    limit: 1
  )

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = Net::HTTP::Get.new(uri)
  request["User-Agent"] = "WW2-Research-Map/1.0 (stuart.frosty@gmail.com)"


  response = http.request(request)

  results = JSON.parse(response.body)

  return nil if results.empty?

  {
    display_name: results[0]["display_name"],
    lat: results[0]["lat"].to_f,
    lon: results[0]["lon"].to_f
  }
end

data = JSON.load_file("./data/data.geojson")

data["features"].each do |feature|
  next if feature["geometry"]["coordinates"].all?

  place = feature["properties"]["place"]
  geocode_data = geocode(place)
  puts geocode_data[:display_name]

  feature["geometry"]["coordinates"] = [geocode_data[:lon], geocode_data[:lat]]
  sleep 1.1
end

File.write("./data/data.geojson", data.to_json)
