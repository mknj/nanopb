
MeasurementEvent

MeasurementEvent : array | "M"

Topic : string
Timestamp : integer
AccessMode : integer
Channel : integer
Measurement : object

Struct Measurement : array | "s" | optional

Value : float
Alarm : integer
Unit : integer
Descriptopn : integer
Range : integer
Test : integer

Struct Measurement DescriptionIndex : integer | "d" | optional
Struct Measurement Position : integer | "p" | optional
Struct Measurement PositionIndex : integer | "o" | optional
Bool Measurement : bool | "b" | optional
Float Measurement : float | "f" | optional
Int Measurement : integer | "i" | optional

