let JSONStream = require('json-stream')
let fs = require('fs')
let protobuf = require('protobufjs')

function decodeUploadMessage (e) {
  let payload = null
  if (e.P) {
    payload = {
      topic: e.P[0],
      time: e.P[1],
      property: {}
    }
    let v = e.P[2]
    if (typeof v === 'boolean') { payload.property.boolValue = v }
    if (typeof v === 'string') { payload.property.stringValue = v }
    if (typeof v === 'number') { payload.property.intValue = v }
  }
  if (e.R) {
    payload = {
      topic: e.R[0],
      time: e.R[1],
      remove: {}
    }
  }
  if (e.T) {
    payload = {
      topic: e.T[0],
      time: e.T[1],
      text: {
        value: e.T[2]
      }
    }
  }
  if (e.M) {
    payload = {
      topic: e.M[0],
      time: e.M[1],
      measurement: {
        accessmode: e.M[2],
        channel: e.M[3]
      }
    }
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
    } else if (s.b) {
      payload.measurement.ebool = s.b
    } else if (s.f) {
      payload.measurement.value = s.f
    } else if (s.i) {
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
  return payload
}

function writeMessage (benderEvent, payload, out) {
  let message = benderEvent.create(payload)
  let buffer = benderEvent.encode(message).finish()
  let lenbuf
  if (buffer.length < 255) {
    lenbuf = Buffer.alloc(1)
    lenbuf.writeUInt8(buffer.length, 0)
  } else {
    lenbuf = Buffer.alloc(3)
    lenbuf.writeUInt8(255, 0)
    lenbuf.writeUInt16BE(buffer.length, 1)
  }
  out.write(lenbuf)
  out.write(buffer)
  return buffer
}

protobuf.load('../bender.proto', function (err, root) {
  if (err) { throw err }

  // Obtain a message type
  let benderEvent = root.lookupType('bender.event')
  let input = JSONStream()
  fs.createReadStream('../sample.events.json.stream').pipe(input)
  let out = fs.createWriteStream('../sample.events.pb.stream')
  let outFull = fs.createWriteStream('../sample.events.jsonFull.stream')
  input.on('data', function (jsonString) {
    let inputMessage = decodeUploadMessage(jsonString)
    if (inputMessage) {
      let buffer = writeMessage(benderEvent, inputMessage, out)
      let decodedMessageWithDefaults = benderEvent.toObject(benderEvent.decode(buffer), { defaults: true })
      outFull.write(JSON.stringify(decodedMessageWithDefaults) + '\n')
      console.log(JSON.stringify(jsonString).length, buffer.length, decodedMessageWithDefaults.topic)
    } else {
      console.log('bad chunk')
    }
  })
})
