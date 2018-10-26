#include <iostream>
#include <fstream>
#include <string>
#include "bender.pb.h"
#include <google/protobuf/util/json_util.h>
#include <google/protobuf/io/coded_stream.h>
#include <arpa/inet.h>

using namespace google::protobuf::io;
using namespace google::protobuf::util;
using namespace std;

size_t readlen(fstream *input)
{
        size_t len;
        unsigned char uc[2];
        input->read((char*)uc,1); // read one byte
        if(uc[0]<255)
        {
                len=uc[0];
        }else
        {
                input->read((char*)uc,2); // read two bytes
                len=uc[0]*0x100+uc[1];   // convert to big endian uint16
        }
        return len;
}

int main(int argc, char* argv[]) {
  GOOGLE_PROTOBUF_VERIFY_VERSION;
  bender::event e;
  char buffer[1024];
  fstream input("../events.pb.stream", ios::in | ios::binary);
  while(input)
  {
          size_t len=readlen(&input);
          if(input)
          {
                  input.read(buffer,len);
                  if (!e.ParseFromArray(buffer,len)) {
                          cerr << "shit" <<endl;
                  }
                  string s;
                  MessageToJsonString(e,&s);
                  cout<<s<<endl;
          }
  }

  google::protobuf::ShutdownProtobufLibrary();
  return 0;
}
