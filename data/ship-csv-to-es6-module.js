const
    fs = require('fs')
  , csv = ( ''+fs.readFileSync('international-cruise-passengers.csv') )
       .split('\n').slice(1) // convert to array and ditch the first line
  , data = []
  , es6 = [
        '//// DATA'
      , ''
      , 'let data; export default data = ['
      , "    [ 'year', 'pax (hundred-thousands)', 'delta (hundred-thousands)' ]"
    ]

//// Parse the CSV file.
for (let i=0; i<csv.length; i++) {
    const line = csv[i].split(',')
    if (1 === line.length) continue // eg newline at end of csv file
    const [ year, km ] = line
    data[year] = +km
}

//// Build the output `es6` module.
let prev = 0
for (let year in data) {
    const millPax = data[year]
    if (! millPax) continue
    const hunthouPax = ~~(millPax * 10) // convert millions to hundred-thousands
    const delta = hunthouPax - prev
    prev = hunthouPax
    es6.push(`  , [ ${year}, ${hunthouPax}, ${delta} ]`)
}

es6.push(']')
fs.writeFileSync( 'international-cruise-passengers.js', es6.join('\n') )
