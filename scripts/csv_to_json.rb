# - [CSV to JSON Ruby Script? - Stack Overflow]
#   (http://stackoverflow.com/questions/5357711/csv-to-json-ruby-script)
#
# - [Ruby Script for converting CSV to JSON - Stack Overflow]
#   (http://stackoverflow.com/questions/26402182/ruby-script-for-converting-csv-to-json)

require 'csv'
require 'json'
require 'pry'

# CSV::Converters[:blank_to_nil] = lambda do |field|
#   field && field.empty? ? nil : field
# end


# ruby ../examples/csv_to_json.rb Landmarks_and_Places_of_Interest.csv

input_filename = ARGV[0]
output_filename = input_filename.sub(/(csv)$/, 'json')

# options = { col_sep: ',', converters: [:all, :blank_to_nil], headers: true, header_converters: true }
options = { col_sep: ',', converters: :numeric, headers: true }#, header_converters: true }
lines = CSV.open(input_filename, options).readlines
data = lines.map(&:to_hash)
# File.write(output_filename, JSON.generate(data))
pretty_data = JSON.pretty_generate(data)
File.write(output_filename, pretty_data)
# binding.pry

# CSV.foreach(input_filename, options) do |row|
#   filename = output_filename
#   File.open(filename, 'a') { |f| f << JSON.pretty_generate(row.to_hash) }
# end
