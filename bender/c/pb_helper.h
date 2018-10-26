#include <stdio.h>
#include <pb_encode.h>
#include <pb_decode.h>

#define pb_zero(m)                       bzero(&m,sizeof(m))
#define pb_string_release(T,m)           pb_release        (T##_fields,m) 
#define pb_string_encode(T,buffer,len,m) pb_string_encodeI (T##_fields,buffer,len,m)
#define pb_string_decode(T,buffer,len,m) pb_string_decodeI (T##_fields,buffer,len,m)

size_t pb_string_encodeI(const pb_field_t* fields,void*buffer,size_t len, void *m)
{
	pb_ostream_t stream = pb_ostream_from_buffer(buffer, len);
	if(!pb_encode(&stream, fields, m))
	{
		printf("Encoding failed: %s\n", PB_GET_ERROR(&stream));
		return 0;
	}
	return stream.bytes_written;
}

bool pb_string_decodeI(const pb_field_t* fields,void*buffer,size_t len, void *m)
{
	pb_istream_t stream = pb_istream_from_buffer(buffer, len);
	if (!pb_decode(&stream, fields, m))
	{
		printf("Decoding failed: %s\n", PB_GET_ERROR(&stream));
		return false;
	}
	return true;
}
