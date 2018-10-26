#include <stdio.h>
#include <string.h>
#include <pb_encode.h>
#include <pb_decode.h>
#include "pb_helper.h"
#include "bender.pb.h"

int main()
{
    uint8_t buffer[128];

    bender_event event;
    pb_zero(event);
    event.which_one=bender_event_measurement_tag;

    event.topic=strdup("hallo welt");
    event.one.measurement.position = 42;
    event.one.measurement.value = 1.23;
    size_t written;
    
    written=pb_string_encode(bender_event,buffer,128,&event);    
    printf("written=%li\n",written);
    printf("topic=%s pos=%i\n",event.topic,event.one.measurement.position);

    pb_string_release(bender_event,&event);
    printf("topic=%s pos=%i\n",event.topic,event.one.measurement.position);
    pb_zero(event);
    printf("topic=%s pos=%i\n",event.topic,event.one.measurement.position);

    pb_string_decode(bender_event,buffer,written,&event);
    printf("topic=%s pos=%i\n",event.topic,event.one.measurement.position);

    return 0;
}

