var JSONStream = require('json-stream')
var fs = require('fs')

var stream = JSONStream()
fs.createReadStream('../sample.events.json.stream').pipe(stream)
let out = fs.createWriteStream('../sample.events.pb.stream')
let outFull = fs.createWriteStream('../sample.events.jsonFull.stream')
// process.stdin.pipe(stream)
let protobuf = require('protobufjs')

protobuf.load('../bender.proto', function (err, root) {
  if (err) { throw err }

  // Obtain a message type
  var benderEvent = root.lookupType('bender.event')
  stream.on('data', function (e) {
    let payload = null
    if (e.P) {
      payload = {
        topic: e.P[0],
        time: e.P[1],
        property: {
        }}
      let v = e.P[2]
      if (typeof v === 'boolean') payload.property.boolValue = v
      if (typeof v === 'string') payload.property.stringValue = v
      if (typeof v === 'number') payload.property.intValue = v
    }
    if (e.R) {
      payload = {
        topic: e.R[0],
        time: e.R[1],
        remove: {
        }}
    }
    if (e.T) {
      payload = {
        topic: e.T[0],
        time: e.T[1],
        text: {
          value: e.T[2]
        }}
    }
    if (e.M) {
      payload = {
        topic: e.M[0],
        time: e.M[1],
        measurement: {
          accessmode: e.M[2],
          channel: e.M[3]
        }}
      let s = e.M[4]
      if (s.s) {
        payload.measurement = {
          accessmode: e.M[2],
          channel: e.M[3],
          value: s.s[0],
          alarm: s.s[1],
          unit: s.s[2],
          description: s.s[3],
          range: s.s[4],
          test: s.s[5]
        }
      } else
      if (s.b) {
        payload.measurement.ebool = s.b
      } else
      if (s.f) {
        payload.measurement.value = s.f
      } else
      if (s.i) {
        payload.measurement.eint = s.i
      }
      if (s.d) {
        payload.measurement.descriptionindex = s.d
      }
      if (s.p) {
        payload.measurement.position = s.p
      }
      if (s.o) {
        payload.measurement.positionindex = s.o
      }
    }
    if (payload) {
      let message = benderEvent.create(payload)
      let buffer = benderEvent.encode(message).finish()
      let lenbuf
      if(buffer.length<255)
{
      lenbuf=new Buffer(1)
      lenbuf.writeUInt8(buffer.length,0)
}else
{
      lenbuf=new Buffer(3)
      lenbuf.writeUInt8(255,0)
      lenbuf.writeUInt16BE(buffer.length,1)
}
      out.write(lenbuf)
      out.write(buffer)
      let message2 = benderEvent.decode(buffer)
      // let object = benderEvent.toObject(message2, { longs: String, enums: String, bytes: String })
      let object = benderEvent.toObject(message2, { defaults: true })
      console.log(JSON.stringify(e).length, buffer.length, object.topic)
      outFull.write(JSON.stringify(object)+"\n")
      //console.log(JSON.stringify(e).length, buffer.length, JSON.stringify(object))
    } else {
      console.log('bad chunk')
    }
  })
})
