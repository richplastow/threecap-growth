const
    fs = require('fs')
  , csv = ( ''+fs.readFileSync('international-tourist-arrivals-by-world-region.csv') )
       .split('\n').slice(1) // convert to array and ditch the first line
  , data = {
        Africa: []
      , Americas: []
      , 'Asia & Pacific': []
      , Europe: []
      , 'Middle East': []
      , total: []
    }
  , es6 = [
        '//// DATA'
      , ''
      , 'let data; export default data = ['
      , "    [ 'year', 'arrivals (millions)', 'delta (millions)' ]"
    ]

//// Parse the CSV file.
for (let i=0; i<csv.length; i++) {
    const line = csv[i].split(',')
    if (1 === line.length) continue // eg newline at end of csv file
    const [ region, code, year, arrivals ] = line
    data[region][year] = +arrivals
}

//// Fill in missing years.
function fillGaps (region) {
    for (let year=0, prev, run=1, num; year<region.length; year++) {
        const arrivals = region[year]
        if (! arrivals && ! prev) continue // not reached the first data point yet
        if (arrivals) {
            prev = arrivals
            run = 1
            if ( 'number' === typeof region[year-1] ) continue
            if (! region[year-1]) continue
            num = region[year-1][0] + 1
            for (let i=year-1; i>0; i--) {
                const item = region[i]
                if ('number' === typeof item) break
                const itemRun = item[0]
                const itemArrivals = item[1]
                region[i] = itemArrivals + ~~(itemRun * (arrivals - itemArrivals) / num)
            }
        } else {
            region[year] = [run++, prev]
        }
    }
}
fillGaps(data.Africa)
fillGaps(data.Americas)
fillGaps(data['Asia & Pacific'])
fillGaps(data.Europe)
fillGaps(data['Middle East'])

//// Add up the regions.
for (let i=0; i<data.Africa.length; i++) {
    const item = data.Africa[i]
    if (! item) continue
    data.total[i] =
        data.Africa[i]
      + data.Americas[i]
      + data['Asia & Pacific'][i]
      + data.Europe[i]
      + data['Middle East'][i]
    data.total[i] = Math.round(data.total[i] / 1000000)
}


//// Build the output `es6` module.
let prev = 0
for (let year in data.total) {
    const arrivals = data.total[year]
    if (! arrivals) continue
    const delta = arrivals - prev
    prev = arrivals
    es6.push(`  , [ ${year}, ${arrivals}, ${delta} ]`)
}

es6.push(']')
fs.writeFileSync( 'total-international-tourist-arrivals.js', es6.join('\n') )
