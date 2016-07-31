# ruby scripts/merge_cleaned_json_files.rb
#
require 'json'

input_directory = "data/cleaned"
output_file = "data/data.json"

input_files = Dir["#{input_directory}/*.json"]

output = input_files.flat_map do |input_file|
  raw_json_string = File.read(input_file)
  JSON.parse(raw_json_string)
end

data = output.map(&:to_hash)

# File.write(output_filename, JSON.generate(data))
pretty_data = JSON.pretty_generate(data)
File.write(output_file, pretty_data)
