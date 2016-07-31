# The following GeoJSON files follow this common format, where:
# - Most of the information is contained within an Array of Objects,
# - Each Object has unique properties, and
# - All are Points on a map, not shapes
#
#   {
#     "type": "FeatureCollection",
#     "features": [
#       {
#         "type": "Feature",
#         "id": 1247,
#         "properties": {
#           ...
#         }
#         "geometry": {
#           "type": "Point",
#           "coordinates": [
#             147.257275,
#             -37.40845
#           ]
#         }
#       },
#       { ... }
#     ]
#   }

# == Run Command
#     ruby scripts/geojson_to_custom_json.rb
#
require 'json'
require 'ostruct'
require 'pry'

input_directory = "/Users/Sonna/Projects/GovHack/govhack2016/data/original"
input_filenames = [
  "recweb_asset.geojson",
  "recweb_historic_relic.geojson",
  "recweb_hut.geojson",
  "RECWEB_SITE.geojson"
]

input_files = input_filenames.map { |filename| "#{input_directory}/#{filename}"}

def output_file(input_filename)
  input_filename.sub(/(geojson)$/, 'json').sub(%r(/original/), '/cleaned/')
end

input_files.each do |input_file|
  output_filename = output_file(input_file)
  raw_json_string = File.read(input_file)
  json_hash = JSON.parse(raw_json_string, object_class: OpenStruct)

  output = json_hash.features.map do |feature|
    name = feature.properties["NAME"] || feature.properties["LABEL"]

    description =
      feature.properties["COMMENTS"] ||
      feature.properties["ACCESS_DSC"]

    tags = [
      feature.properties["FAC_TYPE"],
      feature.properties["CATEGORY"],
      feature.properties["TYPE"],
      (feature.properties["CAMPING"] == "Y" ? "camping" : feature.properties["CAMPING"]),
      (feature.properties["CARAVAN"] == "Y" ? "caravan" : feature.properties["CARAVAN"]),
      (feature.properties["HERITAGE"] == "Y" ? "heritage" : feature.properties["HERITAGE"]),
      (feature.properties["FISHING"] == "Y" ? "fishing" : feature.properties["FISHING"]),
      (feature.properties["PICNICING"] == "Y" ? "picnicing" : feature.properties["PICNICING"]),
      (feature.properties["WALKINGDOG"] == "Y" ? "walkingdog" : feature.properties["WALKINGDOG"])
    ].compact.reject(&:empty?)

    image = feature.properties.photo_id_1

    {
      id: feature.id,
      name: name,
      image: image,
      description: description,
      latitude: feature.geometry.coordinates[0],
      longitude: feature.geometry.coordinates[1],
      tags: tags
    }
  end

  data = output.map(&:to_hash)

  # File.write(output_filename, JSON.generate(data))
  pretty_data = JSON.pretty_generate(data)
  File.write(output_file(output_filename), pretty_data)
end
