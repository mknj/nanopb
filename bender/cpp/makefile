all:
	protoc --proto_path=.. --cpp_out=. ../bender.proto 
	g++ -o main main.cc bender.pb.cc -lprotobuf
clean:
	rm -f main bender.pb.*
