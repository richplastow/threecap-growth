const
    fs = require('fs')
  , csv = ( ''+fs.readFileSync('international-flight-passenger-km.csv') )
       .split('\n').slice(1) // convert to array and ditch the first line
  , data = []
  , es6 = [
        '//// DATA'
      , ''
      , 'let data; export default data = ['
      , "    [ 'year', 'km (billions)', 'delta (billions)' ]"
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
    const tnkm = data[year]
    if (! tnkm) continue
    const bnkm = tnkm * 1000 // convert trillions to billions
    const delta = bnkm - prev
    prev = bnkm
    es6.push(`  , [ ${year}, ${bnkm}, ${delta} ]`)
}

es6.push(']')
fs.writeFileSync( 'international-flight-passenger-km.js', es6.join('\n') )
