# - [CSV to JSON Ruby Script? - Stack Overflow]
#   (http://stackoverflow.com/questions/5357711/csv-to-json-ruby-script)
#
# - [Ruby Script for converting CSV to JSON - Stack Overflow]
#   (http://stackoverflow.com/questions/26402182/ruby-script-for-converting-csv-to-json)

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
    "Theme": :category,
    "Sub Theme": :sub_category,
    "Feature Name": :name,
    "Co-ordinates": :coordinates
  }

  header_map.keys.include?(h.to_sym) ? header_map[h.to_sym] : h
end

def deteremine_category(category)
  leisure_themes = [
    "Leisure/Recreation",
    "Place Of Assembly",
    "Community Use"
  ]

  if leisure_themes.include?(category)
    return "Leisure"
  end

  if "shelter" == category.downcase
    return "Huts and shelters"
  end

  if "picnic" == category.downcase
    "Picnicing"
  end

  if "place of worship" == category.downcase
    return "Places of worship"
  end

  return category
end

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

input_filename = ARGV[0] || "data/original/Landmarks_and_Places_of_Interest.csv"
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
  # "(-37.7881645889621, 144.939277838304)"
  line[:longitude], line[:latitude] =
    line[:coordinates].gsub(%r{[()""]}, "").split(", ").map { |coordinate| to_numeric(coordinate) }
  # =>
  # longitude: -37.7881645889621,
  # latitude: 144.939277838304

  line[:tags] = []
  line[:tags] << deteremine_category(line[:category])
  line[:tags] << deteremine_category(line[:sub_category])

  line.delete(:category)
  line.delete(:sub_category)
  line.delete(:coordinates)
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
