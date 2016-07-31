# ruby scripts/merge_cleaned_json_files.rb
#
require 'json'

io_directory = "data"
input_file = "#{io_directory}/data.json"

raw_json_string = File.read(input_file)
json_hash = JSON.parse(raw_json_string)

categories = json_hash.flat_map { |record| record["tags"] }
categories.uniq!

categories.each do |category|
  output = json_hash.select { |record| record["tags"].include?(category) }
  data = output.map(&:to_hash)

  filename = category.downcase.gsub(/\//, '_').gsub(/ /, '_')
  output_file = "#{io_directory}/categories/data_#{filename}.json"

  # File.write(output_filename, JSON.generate(data))
  pretty_data = JSON.pretty_generate(data)
  File.write(output_file, pretty_data)
end
