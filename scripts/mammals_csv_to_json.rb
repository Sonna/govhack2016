# - [CSV to JSON Ruby Script? - Stack Overflow]
#   (http://stackoverflow.com/questions/5357711/csv-to-json-ruby-script)
#
# - [Ruby Script for converting CSV to JSON - Stack Overflow]
#   (http://stackoverflow.com/questions/26402182/ruby-script-for-converting-csv-to-json)

require_relative 'common/conversion_map.rb'

require 'csv'
require 'json'
require 'pry'

require 'bigdecimal'

def to_numeric(anything)
  num = BigDecimal.new(anything.to_s)
  if num.frac == 0
    num.to_i
  else
    num.to_f
  end
end

# CSV::Converters[:blank_to_nil] = lambda do |field|
#   field && field.empty? ? nil : field
# end

# CSV::Converters[:mytime] = lambda do |s|
#   Time.parse(s)
# rescue ArgumentError
#   s
# end

rename_headers = lambda do |h|
  header_map = {
    "Scientific Name": :description,
    "Vernacular Name - matched": :name,
    "Longitude - original": :latitude,
    "Latitude - original": :longitude
  }

  header_map.keys.include?(h.to_sym) ? header_map[h.to_sym] : h
end

HEADERS_TO_DELETE = [
  "Record ID",
  "Catalog Number",
  "Match Taxon Concept GUID",
  "Vernacular Name",
  "Matched Scientific Name",
  "Taxon Rank - matched",
  "Kingdom - matched",
  "Phylum - matched",
  "Class - matched",
  "Order - matched",
  "Family - matched",
  "Genus - matched",
  "Species - matched",
  "Subspecies - matched",
  "Institution Code",
  "Collection Code",
  "locality",
  "geodetic Datum",
  "Latitude - processed",
  "Longitude - processed",
  "Coordinate Uncertainty in Metres - parsed",
  "Country - parsed",
  "IBRA 7 Regions",
  "IMCRA 4 Regions",
  "State - parsed",
  "Local Government Areas",
  "Minimum Elevation In Metres",
  "Maximum Elevation In Metres",
  "Minimum Depth In Meters",
  "Maximum Depth In Meters",
  "Collector",
  "Year - parsed",
  "Month - parsed",
  "Event Date - parsed",
  "Basis Of Record - original",
  "Basis Of Record - processed",
  "Sex",
  "Outlier for layer",
  "Taxon identification issue",
  "Location Quality",
  "Data Resource ID",
  "Data Resource Name",
  "Occurrence status assumed to be present",
  "Country inferred from coordinates",
  "First of the month",
  "First of the year",
  "Geodetic datum assumed WGS84",
  "Identification date before occurrence date"
]

# extract_coordinates = lambda do |h|
#   header_map = [
#     :"Co-ordinates",
#      :coordinates
#   ]

#   header_map.keys.include?(h.to_sym) ? header_map[h.to_sym] : h
# end

# CSV::Converters[:coordinates] = lambda do |h|
#   HEADER_MAP.keys.include?(h.to_sym) ? HEADER_MAP[h.to_sym] : h
# end

# ruby scripts/Landmarks_and_Places_of_Interest_csv_to_json.rb data/original/Landmarks_and_Places_of_Interest.csv

input_filename = ARGV[0] || "data/original/mammals.csv"
output_filename = input_filename.sub(/(csv)$/, 'json').sub(%r(/original/), '/cleaned/')
puts output_filename
# options = { col_sep: ',', converters: [:all, :blank_to_nil], headers: true, header_converters: true }
options = {
  col_sep: ',',
  converters: :numeric,
  headers: true,
  header_converters: [rename_headers]
}
lines = CSV.open(input_filename, options).readlines

lines.each_with_index do |line, index|
  line[:id] = index
  line[:tags] = [
    "mammals",
    "Wildlife"
  ]

  line[:longitude] = (line[:longitude] * 1_000_000).floor / 1_000_000.0
  line[:latitude]  = (line[:latitude] * 1_000_000).floor / 1_000_000.0

  HEADERS_TO_DELETE.each { |header| line.delete(header) }
end

# binding.pry
data = lines.map(&:to_hash)

# File.write(output_filename, JSON.generate(data))
pretty_data = JSON.pretty_generate(data)
File.write(output_filename, pretty_data)

# CSV.foreach(input_filename, options) do |row|
#   filename = output_filename
#   File.open(filename, 'a') { |f| f << JSON.pretty_generate(row.to_hash) }
# end
