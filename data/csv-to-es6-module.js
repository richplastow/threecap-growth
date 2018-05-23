const
    fs = require('fs')
  , csv1 = (''+fs.readFileSync('simplemaps-worldcities-basic.csv')).split('\n').slice(1)
  , csv2 = (''+fs.readFileSync('travelbird-most-welcoming-cities.csv')).split('\n').slice(1)
  , es6 = [
        '//// DATA'
      , ''
      , 'let data; export default data = ['
      , "    [ 'pop', 'city', 'x', 'y', 'z', 'lat', 'lon', 'overtourism' ]"
    ]

    //// By city name, eg `{ London:7.06, ...}`
  , overtourismScores = {}

    //// In `pop` order eg `{ GBR:[ ['London', ...],['Birmingham', ...] ], ...}`
  , citiesBySize = {}

let
    totalOvertourismScore = 0 // used to find the average
  , averageOvertourismScore

//// Parse the overtourism scores of cities listed in
//// https://travelbird.nl/most-welcoming-cities/
for (let i=0; i<csv2.length; i++) {
    const line = csv2[i].split(',')
    if (1 === line.length) continue // eg newline at end of csv file
    let [ welcomingrank, city_ascii, country, expert, port, safety, happiness, english
        , openness, overtourism, welcomingscore ] = line
    overtourism = 10 - overtourism // make Venice and Barcelona high scoring
    overtourismScores[city_ascii] = { overtourism, country }
    totalOvertourismScore += overtourism
}
averageOvertourismScore = totalOvertourismScore / 100


//// Build `citiesBySize`, sorting each city by population, keeping the biggest.
for (let i=0; i<csv1.length; i++) {
    const line = csv1[i].split(',')
    if (1 === line.length) continue // eg newline at end of csv file
    let [ city, city_ascii, lat, lon, pop, country, iso2, iso3 ] = line
    // if (10000 > pop) continue // ignore smaller cities
    iso3 = 'United States of America' === iso3 ? 'USA' : iso3 // simplemaps error
    citiesBySize[iso3] = citiesBySize[iso3] || []
    const { x, y, z } = latLonToXYZ(lat, lon, 100.5)
    let overtourism = 0
    if (overtourismScores[city_ascii] && overtourismScores[city_ascii].country === country) {
        if (averageOvertourismScore < overtourismScores[city_ascii].overtourism)
            overtourism = overtourismScores[city_ascii].overtourism - averageOvertourismScore
        delete overtourismScores[city_ascii]
    }
    citiesBySize[iso3].push([
        pop, city, x, y, z, lat, lon, overtourism
    ])
}
for (let iso3 in citiesBySize) {
    citiesBySize[iso3].sort( (a, b) => b[0] - a[0] ) // `[0]` is population
    // const biggestNum = Math.max(100, citiesBySize[iso3].length * 0.5)
    // citiesBySize[iso3] = citiesBySize[iso3].slice(0, biggestNum)
}


//// Build the output `es6` module.
for (let iso3 in citiesBySize) {
    es6.push(`// ${iso3}`)
    for (let i=0; i<citiesBySize[iso3].length; i++) {
        const [ pop, city, x, y, z, lat, lon, overtourism ] = citiesBySize[iso3][i]
        // if (1000000 > pop) continue // ignore smaller cities
        // let overtourism = ~~(Math.random()*1000)
        // overtourism = 100 < overtourism ? 0 : overtourism
        es6.push(
            `  , [ ${pop}, '${city.replace(/'/g,'’')}'`
          + `, ${x},${y},${z}, ${lat},${lon}, ${overtourism} ]`
        )
    }
}

es6.push(']')
fs.writeFileSync( 'worldcities.js', es6.join('\n') )




//// UTILITY

function latLonToXYZ (lat, lon, rad) {
    // lat = Math.PI / 2 - lat // Flip the Y axis
    const cosLat = Math.cos(lat * Math.PI / 180)
    const sinLat = Math.sin(lat * Math.PI / 180)
    const cosLon = Math.cos(lon * Math.PI / 180)
    const sinLon = Math.sin(lon * Math.PI / 180)
    const x = rad * cosLat * cosLon
    const y = rad * cosLat * sinLon
    const z = rad * sinLat
    return {
        x: x
      , y: z   // for correct THREE.js coords, swap y with z...
      , z: - y // ...and z with -y
    }

    // //// Flip the Y axis.
    // lat = Math.PI / 2 - lat
    //
    // //// Distribute to sphere.
    // return {
    //     x: rad * Math.sin(lat) * Math.sin(lon)
    //   , y: rad * Math.cos(lat)
    //   , z: rad * Math.sin(lat) * Math.cos(lon)
    // }
    // return {
    //     x: rad * Math.cos(lat) * Math.cos(lon)
    //   , y: rad * Math.cos(lat) * Math.sin(lon)
    //   , z: rad * Math.sin(lat)
    // }
}
